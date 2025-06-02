import os
import uvicorn
from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from datetime import datetime
import json

# Importar módulos propios
from models.database import get_supabase_client
from services.openai_service import generar_receta_con_ia

# Cargar variables de entorno
load_dotenv()

# Inicializar FastAPI
app = FastAPI(
    title="SafeAlert - Módulo de Recetas Inteligentes",
    description="API para generar y gestionar recetas con IA utilizando productos próximos a vencer",
    version="1.0.0"
)

# Configurar templates
templates = Jinja2Templates(directory="templates")

# Endpoint de salud
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "module": "recetas", "port": 3002}

# Rutas para la interfaz web
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    """Página principal del módulo de recetas"""
    supabase = get_supabase_client()
    
    # Obtener recetas
    response = supabase.table("recetas").select("*").order("created_at", desc=True).execute()
    recetas = response.data
    
    # Obtener productos próximos a vencer
    response = supabase.table("productos").select("*").eq("estado", "proximo_vencer").order("fecha_caducidad").execute()
    productos_proximos = response.data
    
    return templates.TemplateResponse(
        "index.html", 
        {
            "request": request, 
            "recetas": recetas,
            "productos_proximos": productos_proximos,
            "fecha_actual": datetime.now().strftime("%Y-%m-%d")
        }
    )

@app.get("/generar-receta", response_class=HTMLResponse)
async def formulario_generar_receta(request: Request):
    """Formulario para generar una nueva receta con IA"""
    supabase = get_supabase_client()
    
    # Obtener productos próximos a vencer
    response = supabase.table("productos").select("*").eq("estado", "proximo_vencer").order("fecha_caducidad").execute()
    productos = response.data
    
    # Obtener tipos de comida
    response_tipos = supabase.table("tipos_comida").select("*").execute()
    tipos_comida = response_tipos.data
    
    return templates.TemplateResponse(
        "generar_receta.html", 
        {
            "request": request, 
            "productos": productos,
            "tipos_comida": tipos_comida
        }
    )

@app.post("/generar-receta")
async def procesar_generar_receta(
    request: Request,
    productos_ids: str = Form(...),
    tipo_comida_id: int = Form(None),
    porciones: int = Form(4)
):
    """Procesar la generación de una receta con IA"""
    supabase = get_supabase_client()
    
    # Convertir string de IDs a lista
    productos_ids_list = [int(id) for id in productos_ids.split(",") if id]
    
    if not productos_ids_list:
        raise HTTPException(status_code=400, detail="Debe seleccionar al menos un producto")
    
    # Obtener información de los productos
    response = supabase.table("productos").select("*").in_("id", productos_ids_list).execute()
    productos = response.data
    
    if not productos:
        raise HTTPException(status_code=404, detail="No se encontraron los productos seleccionados")
    
    # Obtener tipo de comida si se especificó
    tipo_comida_nombre = "cualquiera"
    if tipo_comida_id:
        response_tipo = supabase.table("tipos_comida").select("nombre").eq("id", tipo_comida_id).execute()
        if response_tipo.data:
            tipo_comida_nombre = response_tipo.data[0]["nombre"]
    
    # Generar receta con OpenAI
    try:
        receta_generada = await generar_receta_con_ia(productos, tipo_comida_nombre, porciones)
        
        # Crear la receta en la base de datos
        nueva_receta = {
            "nombre": receta_generada["nombre"],
            "descripcion": receta_generada["descripcion"],
            "instrucciones": receta_generada["texto_completo"],
            "tiempo_preparacion": receta_generada["tiempo"],
            "porciones": porciones,
            "tipo_comida_id": tipo_comida_id,
            "generada_por_ia": True,
            "prompt_ia": receta_generada["prompt"]
        }
        
        response = supabase.table("recetas").insert(nueva_receta).execute()
        receta_id = response.data[0]["id"]
        
        # Relacionar productos con la receta
        for producto_id in productos_ids_list:
            supabase.table("productos_relacionados").insert({
                "receta_id": receta_id,
                "producto_id": producto_id,
                "cantidad_necesaria": 1
            }).execute()
        
        # Guardar recomendación IA
        supabase.table("recomendaciones_ia").insert({
            "productos_input": json.dumps(productos_ids_list),
            "receta_generada_id": receta_id,
            "confianza_score": 0.85,
            "modelo_usado": "gpt-4o",
        }).execute()
        
        # Redirigir a la página de la receta
        return RedirectResponse(url=f"/recetas/{receta_id}", status_code=303)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando receta: {str(e)}")

# API endpoints
@app.get("/api/recetas")
async def api_obtener_recetas():
    """API para obtener todas las recetas"""
    supabase = get_supabase_client()
    response = supabase.table("recetas").select("*").order("created_at", desc=True).execute()
    return {"recetas": response.data}

@app.post("/api/recetas/generar")
async def api_generar_receta(request: Request):
    """API para generar una receta con IA"""
    body = await request.json()
    productos_ids = body.get("productos_ids", [])
    tipo_comida = body.get("tipo_comida", "cualquiera")
    porciones = body.get("porciones", 4)
    
    supabase = get_supabase_client()
    
    # Obtener información de los productos
    response = supabase.table("productos").select("*").in_("id", productos_ids).execute()
    productos = response.data
    
    if not productos:
        raise HTTPException(status_code=404, detail="No se encontraron los productos seleccionados")
    
    # Generar receta con OpenAI
    try:
        receta_generada = await generar_receta_con_ia(productos, tipo_comida, porciones)
        
        # Crear la receta en la base de datos
        nueva_receta = {
            "nombre": receta_generada["nombre"],
            "descripcion": receta_generada["descripcion"],
            "instrucciones": receta_generada["texto_completo"],
            "tiempo_preparacion": receta_generada["tiempo"],
            "porciones": porciones,
            "generada_por_ia": True,
            "prompt_ia": receta_generada["prompt"]
        }
        
        response = supabase.table("recetas").insert(nueva_receta).execute()
        receta_id = response.data[0]["id"]
        
        # Relacionar productos con la receta
        for producto_id in productos_ids:
            supabase.table("productos_relacionados").insert({
                "receta_id": receta_id,
                "producto_id": producto_id,
                "cantidad_necesaria": 1
            }).execute()
        
        # Obtener la receta completa
        response = supabase.table("recetas").select("*").eq("id", receta_id).single().execute()
        receta_completa = response.data
        
        return {
            "receta": receta_completa,
            "texto_generado": receta_generada["texto_completo"],
            "productos_utilizados": productos
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando receta: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3002, reload=True)

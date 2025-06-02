import os
from openai import OpenAI
from dotenv import load_dotenv
import re
from typing import List, Dict, Any

# Cargar variables de entorno
load_dotenv()

# Configurar OpenAI con la nueva sintaxis
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

async def generar_receta_con_ia(productos: List[Dict[str, Any]], tipo_comida: str = "cualquiera", porciones: int = 4) -> Dict[str, Any]:
    """
    Genera una receta utilizando OpenAI basada en productos próximos a vencer
    """
    # Crear texto de productos
    productos_texto = []
    for p in productos:
        productos_texto.append(f"{p['nombre']} ({p['cantidad_stock']} unidades, vence: {p['fecha_caducidad']})")
    
    productos_str = ", ".join(productos_texto)
    
    # Crear prompt para OpenAI
    prompt = f"""
    Eres un chef experto en reducir desperdicio alimentario. 
    
    Tengo estos productos que están próximos a vencer:
    {productos_str}
    
    Tipo de comida deseada: {tipo_comida}
    Porciones: {porciones}
    
    Por favor, genera una receta que:
    1. Use la mayoría de estos productos
    2. Sea deliciosa y nutritiva
    3. Ayude a evitar el desperdicio
    4. Sea fácil de preparar
    
    Formato de respuesta:
    NOMBRE: [nombre de la receta]
    DESCRIPCIÓN: [breve descripción]
    TIEMPO: [tiempo en minutos]
    INGREDIENTES:
    - [ingrediente 1]
    - [ingrediente 2]
    ...
    INSTRUCCIONES:
    1. [paso 1]
    2. [paso 2]
    ...
    """
    
    try:
        # Llamar a la API de OpenAI con la nueva sintaxis
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un chef experto en crear recetas para reducir el desperdicio alimentario."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        # Extraer texto generado
        texto_generado = response.choices[0].message.content
        
        # Parsear la respuesta
        nombre = "Receta Generada por IA"
        descripcion = "Receta creada para reducir desperdicio alimentario"
        tiempo = 30
        
        # Extraer nombre
        nombre_match = re.search(r"NOMBRE:\s*(.*)", texto_generado)
        if nombre_match:
            nombre = nombre_match.group(1).strip()
            
        # Extraer descripción
        descripcion_match = re.search(r"DESCRIPCIÓN:\s*(.*)", texto_generado)
        if descripcion_match:
            descripcion = descripcion_match.group(1).strip()
            
        # Extraer tiempo
        tiempo_match = re.search(r"TIEMPO:\s*(\d+)", texto_generado)
        if tiempo_match:
            tiempo = int(tiempo_match.group(1))
        
        return {
            "nombre": nombre,
            "descripcion": descripcion,
            "tiempo": tiempo,
            "texto_completo": texto_generado,
            "prompt": prompt
        }
        
    except Exception as e:
        raise Exception(f"Error al generar receta con OpenAI: {str(e)}")
"use client";

import { createClient } from "@supabase/supabase-js";
import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Package,
  ChefHat,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Brain,
} from "lucide-react";

// Inicializa el cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "<TU_SUPABASE_URL>";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "<TU_SUPABASE_ANON_KEY>";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ModuloEstado {
  nombre: string;
  puerto: number;
  estado: "online" | "offline" | "loading";
  url: string;
  descripcion: string;
  icono: React.ReactNode;
  color: string;
}

interface Estadisticas {
  inventario: {
    total_productos: number;
    proximos_vencer: number;
    vencidos: number;
    valor_total: number;
  };
  recetas: {
    total_recetas: number;
    generadas_ia: number;
    productos_utilizados: number;
  };
  alertas: {
    alertas_activas: number;
    productos_criticos: number;
    productos_salvados: number;
    dinero_ahorrado: number;
  };
}

const colorClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
};

const modulosIniciales: ModuloEstado[] = [
  {
    nombre: "Inventario",
    puerto: 3001,
    estado: "loading",
    url: "http://localhost:3001",
    descripcion: "Gestión inteligente de inventario con clasificación IA",
    icono: <Package className="h-6 w-6" />,
    color: "blue",
  },
  {
    nombre: "Recetas IA",
    puerto: 3002,
    estado: "loading",
    url: "http://localhost:3002",
    descripcion:
      "Generación de recetas con OpenAI para productos próximos a vencer",
    icono: <ChefHat className="h-6 w-6" />,
    color: "green",
  },
  {
    nombre: "Alertas & Reportes",
    puerto: 3003,
    estado: "loading",
    url: "http://localhost:3003",
    descripcion: "Sistema de alertas inteligentes y reportes estadísticos",
    icono: <AlertTriangle className="h-6 w-6" />,
    color: "red",
  },
];

export default function SafeAlertUnificado() {
  const [modulos, setModulos] = useState<ModuloEstado[]>(modulosIniciales);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    inventario: {
      total_productos: 0,
      proximos_vencer: 0,
      vencidos: 0,
      valor_total: 0,
    },
    recetas: {
      total_recetas: 0,
      generadas_ia: 0,
      productos_utilizados: 0,
    },
    alertas: {
      alertas_activas: 0,
      productos_criticos: 0,
      productos_salvados: 0,
      dinero_ahorrado: 0,
    },
  });

  useEffect(() => {
    verificarEstadoModulos();
    cargarEstadisticas();
  }, []);

  const verificarEstadoModulos = async () => {
    const nuevosModulos = await Promise.all(
      modulos.map(async (modulo) => {
        try {
          const response = await fetch(`${modulo.url}/api/health`);
          return {
            ...modulo,
            estado: response.ok ? "online" : "offline",
          } as ModuloEstado;
        } catch (error) {
          return { ...modulo, estado: "offline" } as ModuloEstado;
        }
      })
    );
    setModulos(nuevosModulos);
  };

  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
      // Obtener estadísticas de inventario desde Supabase
      const { data: inventarioData, error: inventarioError } = await supabase
        .from("productos")
        .select(
          `
        total_productos:count(*),
        proximos_vencer:count(CASE WHEN fecha_caducidad <= NOW() + INTERVAL '7 days' THEN 1 END),
        vencidos:count(CASE WHEN fecha_caducidad < NOW() THEN 1 END),
        valor_total:sum(precio_unitario * cantidad_stock)
      `
        )
        .single();

      if (inventarioError) throw inventarioError;

      // Obtener estadísticas de recetas desde Supabase
      const { data: recetasData, error: recetasError } = await supabase
        .from("recetas")
        .select(
          `
        total_recetas:count(*),
        generadas_ia:count(CASE WHEN generada_por_ia = TRUE THEN 1 END),
        productos_utilizados:0
      `
        )
        .single();

      if (recetasError) throw recetasError;

      // Obtener estadísticas de alertas desde Supabase
      const { data: alertasData, error: alertasError } = await supabase
        .from("alertas")
        .select(
          `
        alertas_activas:count(CASE WHEN estado = 'activa' THEN 1 END),
        productos_criticos:count(CASE WHEN nivel_prioridad_id = (SELECT id FROM niveles_prioridad WHERE nombre = 'critico') THEN 1 END),
        productos_salvados:count(CASE WHEN estado != 'activa' THEN 1 END),
        dinero_ahorrado:0
      `
        )
        .single();

      if (alertasError) throw alertasError;

      // Actualizar el estado con los datos reales de Supabase
      setEstadisticas({
        inventario: {
          total_productos: inventarioData?.total_productos || 0,
          proximos_vencer: inventarioData?.proximos_vencer || 0,
          vencidos: inventarioData?.vencidos || 0,
          valor_total: inventarioData?.valor_total || 0,
        },
        recetas: {
          total_recetas: recetasData?.total_recetas || 0,
          generadas_ia: recetasData?.generadas_ia || 0,
          productos_utilizados: recetasData?.productos_utilizados || 0,
        },
        alertas: {
          alertas_activas: alertasData?.alertas_activas || 0,
          productos_criticos: alertasData?.productos_criticos || 0,
          productos_salvados: alertasData?.productos_salvados || 0,
          dinero_ahorrado: alertasData?.dinero_ahorrado || 0,
        },
      });

      console.log("Datos cargados exitosamente:", {
        inventarioData,
        recetasData,
        alertasData,
      });
    } catch (error) {
      console.error("Error cargando estadísticas desde Supabase:", error);
      // Mantener el estado en ceros en caso de error
      setEstadisticas({
        inventario: {
          total_productos: 0,
          proximos_vencer: 0,
          vencidos: 0,
          valor_total: 0,
        },
        recetas: { total_recetas: 0, generadas_ia: 0, productos_utilizados: 0 },
        alertas: {
          alertas_activas: 0,
          productos_criticos: 0,
          productos_salvados: 0,
          dinero_ahorrado: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirModulo = (url: string) => {
    window.open(url, "_blank");
  };

  const getEstadoColor = (estado: ModuloEstado["estado"]) => {
    switch (estado) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-red-100 text-red-800";
      case "loading":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoTexto = (estado: ModuloEstado["estado"]) => {
    switch (estado) {
      case "online":
        return "En línea";
      case "offline":
        return "Desconectado";
      case "loading":
        return "Verificando...";
      default:
        return "Desconocido";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Cargando SafeAlert
          </h2>
          <p className="text-gray-600">Conectando con todos los módulos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                SafeAlert Platform
              </h1>
              <p className="text-gray-600 mt-2">
                Plataforma unificada de gestión inteligente para reducción de
                desperdicio alimentario
              </p>
            </div>
            <Button
              onClick={verificarEstadoModulos}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Estado de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {modulos.map((modulo) => (
            <Card
              key={modulo.nombre}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => abrirModulo(modulo.url)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${colorClasses[modulo.color]}`}
                    >
                      {modulo.icono}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{modulo.nombre}</CardTitle>
                      <p className="text-sm text-gray-500">
                        Puerto {modulo.puerto}
                      </p>
                    </div>
                  </div>
                  <Badge className={getEstadoColor(modulo.estado)}>
                    {getEstadoTexto(modulo.estado)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {modulo.descripcion}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{modulo.url}</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estadísticas Globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Productos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estadisticas.inventario.total_productos}
              </div>
              <p className="text-xs text-muted-foreground">En inventario</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Próximos a Vencer
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {estadisticas.inventario.proximos_vencer}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren atención
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recetas Generadas
              </CardTitle>
              <ChefHat className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {estadisticas.recetas.total_recetas}
              </div>
              <p className="text-xs text-muted-foreground">
                {estadisticas.recetas.generadas_ia} con IA
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Dinero Ahorrado
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                €{estadisticas.alertas.dinero_ahorrado}
              </div>
              <p className="text-xs text-muted-foreground">
                Por alertas resueltas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede directamente a las funciones principales de cada módulo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => abrirModulo("http://localhost:3001")}
                className="flex items-center gap-2 h-auto p-4 flex-col"
                variant="outline"
              >
                <Package className="h-6 w-6 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Gestionar Inventario</div>
                  <div className="text-xs text-gray-500">
                    Agregar productos y ver clasificaciones IA
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => abrirModulo("http://localhost:3002/")}
                className="flex items-center gap-2 h-auto p-4 flex-col"
                variant="outline"
              >
                <ChefHat className="h-6 w-6 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Generar Receta IA</div>
                  <div className="text-xs text-gray-500">
                    Crear recetas con productos próximos a vencer
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => abrirModulo("http://localhost:3003")}
                className="flex items-center gap-2 h-auto p-4 flex-col"
                variant="outline"
              >
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <div className="text-center">
                  <div className="font-medium">Ver Alertas</div>
                  <div className="text-xs text-gray-500">
                    Monitorear alertas y generar reportes
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            SafeAlert Platform - Sistema unificado de gestión inteligente para
            reducción de desperdicio alimentario
          </p>
          <p className="text-xs mt-1">
            Módulos: TypeScript (Puerto 3001) • Python (Puerto 3002) • PHP
            (Puerto 3003)
          </p>
        </div>
      </div>
    </div>
  );
}

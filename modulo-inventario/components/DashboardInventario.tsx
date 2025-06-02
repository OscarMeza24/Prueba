"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Package, AlertTriangle, Plus, DollarSign, X } from "lucide-react";

interface Producto {
  id: number;
  nombre: string;
  fecha_caducidad: string;
  cantidad_stock: number;
  precio_unitario?: number;
  estado: string;
  clasificacion_ia?: string;
}

export function DashboardInventario() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    fecha_caducidad: "",
    cantidad_stock: 0,
    precio_unitario: 0,
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/inventario/productos");
      const data = await response.json();
      setProductos(data.productos || []);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const agregarProducto = async () => {
    try {
      const response = await fetch("/api/inventario/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (response.ok) {
        const data = await response.json();
        setProductos([...productos, data.producto]);
        setNuevoProducto({
          nombre: "",
          fecha_caducidad: "",
          cantidad_stock: 0,
          precio_unitario: 0,
        });
        setMostrarFormulario(false);
        alert("¡Producto agregado exitosamente!");
      } else {
        alert("Error al agregar producto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al agregar producto");
    }
  };

  const estadisticas = {
    total: productos.length,
    proximosVencer: productos.filter((p) => p.estado === "proximo_vencer")
      .length,
    vencidos: productos.filter((p) => p.estado === "vencido").length,
    valorTotal: productos.reduce(
      (acc, p) => acc + (p.precio_unitario || 0) * p.cantidad_stock,
      0
    ),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 animate-pulse mx-auto mb-4 text-blue-600" />
          <p className="text-lg">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                SafeAlert - Inventario
              </h1>
              <p className="text-gray-600 mt-1">
                Gestión inteligente de inventario con IA
              </p>
            </div>
            <Button
              onClick={() => setMostrarFormulario(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nuevo Producto
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Formulario Modal */}
        {mostrarFormulario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Agregar Nuevo Producto</h2>
                <Button
                  onClick={() => setMostrarFormulario(false)}
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    value={nuevoProducto.nombre}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        nombre: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                    placeholder="Ej: Leche Entera"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Fecha de Caducidad
                  </label>
                  <input
                    type="date"
                    value={nuevoProducto.fecha_caducidad}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        fecha_caducidad: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cantidad en Stock
                  </label>
                  <input
                    type="number"
                    value={nuevoProducto.cantidad_stock}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        cantidad_stock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Precio Unitario (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={nuevoProducto.precio_unitario}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        precio_unitario: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={agregarProducto}
                    className="flex-1"
                    disabled={
                      !nuevoProducto.nombre || !nuevoProducto.fecha_caducidad
                    }
                  >
                    Agregar Producto
                  </Button>
                  <Button
                    onClick={() => setMostrarFormulario(false)}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Productos
              </CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.total}</div>
              <p className="text-xs text-gray-500">En inventario</p>
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
                {estadisticas.proximosVencer}
              </div>
              <p className="text-xs text-gray-500">Requieren atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Productos Vencidos
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {estadisticas.vencidos}
              </div>
              <p className="text-xs text-gray-500">Acción inmediata</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                €{estadisticas.valorTotal.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500">Inventario</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Productos con Clasificación IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{producto.nombre}</h3>
                    <p className="text-sm text-gray-600">
                      Vence: {producto.fecha_caducidad}
                    </p>
                    {producto.clasificacion_ia && (
                      <p className="text-xs text-blue-600 mt-1">
                        IA: {producto.clasificacion_ia}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      Stock: {producto.cantidad_stock}
                    </div>
                    <div className="text-sm text-gray-500">
                      €{(producto.precio_unitario || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

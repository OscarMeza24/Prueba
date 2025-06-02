import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: productos, error } = await supabase
      .from("productos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ productos: productos || [] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, fecha_caducidad, cantidad_stock, precio_unitario } = body;

    const { data, error } = await supabase
      .from("productos")
      .insert([
        {
          nombre,
          fecha_caducidad,
          cantidad_stock,
          precio_unitario,
          estado: "activo",
          clasificacion_ia: `Producto agregado - ${new Date().toLocaleDateString()}`,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ producto: data[0] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}

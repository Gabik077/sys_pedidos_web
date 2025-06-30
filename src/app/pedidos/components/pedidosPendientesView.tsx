"use client";

import { useEffect, useState } from "react";
import { getPedidos } from "@/app/services/stockService";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_venta: string;
  marca: string;
}

interface Detalle {
  id: number;
  idProducto: number;
  cantidad: number;
  precioUnitario: string;
  estado: string;
  producto: Producto;
}

interface Cliente {
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  ruc: string;
}

interface Pedido {
  id: number;
  fechaPedido: string;
  estado: string;
  total: string;
  clienteNombre: string;
  observaciones: string;
  responsable: string;
  cliente: Cliente;
  detalles: Detalle[];
}

export default function PedidosPendientesView() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const pedidos = await getPedidos();

        setPedidos(pedidos);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Lista de Pedidos</h2>
      <div className="max-h-[80vh] overflow-y-auto space-y-4">

      {pedidos.map((pedido) => (
        <div key={pedido.id} className="border p-4 mb-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">
            Pedido #{pedido.id} - {new Date(pedido.fechaPedido).toLocaleString()}
          </h3>
          <p><strong>Cliente:</strong> {pedido.clienteNombre}</p>
          <p><strong>RUC:</strong> {pedido.cliente?.ruc}</p>
          <p><strong>Ciudad:</strong> {pedido.cliente?.ciudad}</p>
          <p><strong>Dirección:</strong> {pedido.cliente?.direccion}</p>
          <p><strong>Observaciones:</strong> {pedido.observaciones}</p>
          <span
  className={`px-2 py-1 rounded font-semibold text-white
    ${
      pedido.estado === "pendiente"
        ? "bg-orange-500"
        : pedido.estado === "entregado"
        ? "bg-green-600"
        : "bg-red-600"
    }
  `}
>
  {pedido.estado}
</span>

          <p><strong>Responsable:</strong> {pedido.responsable || "No asignado"}</p>
          <p><strong>Total:</strong> {Number(pedido.total).toLocaleString("es-PY", { style: "currency", currency: "PYG" })}</p>

          <h4 className="mt-4 font-semibold">Productos</h4>
          <ul className="pl-4 list-disc">
            {pedido.detalles.map((detalle) => (
              <li key={detalle.id}>
                {detalle.producto?.nombre} - Cant: {detalle.cantidad} - Precio Unit:{" "}
                {Number(detalle.precioUnitario).toLocaleString("es-PY", {
                  style: "currency",
                  currency: "PYG",
                })}{" "}
                ({detalle.estado})
              </li>
            ))}
          </ul>
        </div>
      ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getPedidos } from "@/app/services/stockService";
import { Pedido } from "../../../types";
import { FaSyncAlt } from "react-icons/fa";

export default function PedidosPendientesView() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");


  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const pedidos = await getPedidos("pendiente");
      setPedidos(pedidos);
      setFiltroEstado("pendiente"); // Establecer el filtro por defecto
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

   const handleEstadoPedido = async (estado: string) => {
    try {
      setFiltroEstado(estado);
      const pedidos = await getPedidos(estado);
      setPedidos(pedidos);
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-500">Lista de Pedidos</h2>


        <select
            value={filtroEstado}
            onChange={(e) => handleEstadoPedido(e.target.value)}
            className="border rounded px-3 py-2" >

            <option value="pendiente">Pendientes</option>
            <option value="envio_creado">En Envio</option>
            <option value="entregado">Entregados</option>
            <option value="cancelado">Cancelados</option>

          </select>

        <button
          title ="Actualizar Pendientes"
          onClick={fetchPedidos}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >

          {loading ? "cargando..." : <FaSyncAlt className="text-lg" />}
        </button>


      </div>

      <div className="space-y-4 text-gray-500">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="border p-4 mb-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-500">
              Pedido #{pedido.id} - {new Date(pedido.fechaPedido).toLocaleString()}
            </h3>
            <p><strong>Cliente:</strong> {pedido.clienteNombre}</p>
            <p><strong>RUC:</strong> {pedido.cliente?.ruc}</p>
            <p><strong>Ciudad:</strong> {pedido.cliente?.ciudad}</p>
            <p><strong>Dirección:</strong> {pedido.cliente?.direccion}</p>
            <p><strong>Observaciones:</strong> {pedido.observaciones}</p>
            <span
              className={`px-2 py-1 rounded font-semibold text-white ${
                pedido.estado === "pendiente"
                  ? "bg-orange-500"
                  : pedido.estado === "entregado"
                  ? "bg-green-600"
                  : pedido.estado === "envio_creado"
                  ? "bg-blue-400"
                  : pedido.estado === "cancelado"
                  ? "bg-red-500"
                  : "bg-gray-400"
              }`}
            >
              {pedido.estado}
            </span>
            <p><strong>Responsable:</strong> {pedido.responsable || "No asignado"}</p>
            <p><strong>Total:</strong>{" "}
              {Number(pedido.total).toLocaleString("es-PY", {
                style: "currency",
                currency: "PYG",
              })}
            </p>

            <h4 className="mt-4 font-semibold">Productos</h4>
            <ul className="pl-4 list-disc">
              {pedido.detalles.map((detalle) => (
                <li key={detalle.id}>
                  {detalle.producto?.nombre} - Cant: {detalle.cantidad} - Precio Unit:{" "}
                  {Number(detalle.precioUnitario).toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                  })}{" "}
                  {(pedido.estado === "pendiente" || pedido.estado === "envio_creado") ? `(${detalle.estado})` : ""}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

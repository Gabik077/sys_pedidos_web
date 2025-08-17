"use client";

import { useEffect, useState } from "react";
import { getPedidos, updateEstadoPedido } from "@/app/services/stockService";
import { Pedido } from "../../../types";
import { FaDraft2Digital, FaEdit, FaRegEdit, FaSyncAlt, FaTrash } from "react-icons/fa";
import { useUser } from "@/app/context/UserContext";
import { formatearFecha } from "@/app/utils/utils";
import { handleImprimirPedidosSeleccionados } from "../empresion/handleImprimirPedidosSeleccionados";
import { handleImprimirProductosSeleccionados } from "../empresion/handleImprimirProductosSeleccionados";

export default function PedidosPendientesView() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const { token } = useUser();

  if (!token) {
    window.location.href = "/login";
    return null;
  }

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const pedidos = await getPedidos(token, "pendiente");
      setPedidos(pedidos);
      setFiltroEstado("pendiente");
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleEditarPedido = (pedidoId: number) => {
    window.location.href = `/pedidos/edit/${pedidoId}`;
  };

const onCancelarPedido = (pedidoId: number) => {
  if (window.confirm("¿Estás seguro de que deseas cancelar este pedido?")) {
    handleCancelarPedido(pedidoId);
  }
};

    const handleCancelarPedido = async (idPedido: number) => {
      try {

        const res = await updateEstadoPedido(token,idPedido, 'cancelado');

        if (res.status === 'ok') {
          alert('Pedido cancelado correctamente');
          const data = await getPedidos(token,"pendiente");
          setPedidos(data);
        } else {
          alert('Error al cancelar el pedido');
        }
      } catch (err) {
        console.error(err);
        alert('Error en el servidor');
      }
    };

  const handleEstadoPedido = async (estado: string) => {
    try {
      setFiltroEstado(estado);
      const pedidos = await getPedidos(token, estado);
      setPedidos(pedidos);
      setSeleccionados([]); // Reset selección al cambiar filtro
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeleccion = (id: number) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };



  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-500">Lista de Pedidos</h2>

       <select
          value={filtroEstado}
          onChange={(e) => handleEstadoPedido(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="pendiente">Pendientes</option>
          <option value="envio_creado">En Envío</option>
          <option value="entregado">Entregados</option>
          <option value="cancelado">Cancelados</option>
        </select>
        <p><strong>Total Pedidos: {pedidos.length}</strong></p>
        <button
          title="Actualizar Pendientes"
          onClick={fetchPedidos}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Cargando..." : <FaSyncAlt className="text-lg" />}
        </button>


        <button
          onClick={() => handleImprimirProductosSeleccionados(pedidos, seleccionados)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Imprimir Productos
        </button>

        <button
          onClick={() => handleImprimirPedidosSeleccionados(pedidos, seleccionados)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Imprimir Pedidos
        </button>
      </div>

      <div className="space-y-4 text-gray-700">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="border p-4 mb-6 rounded shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-600">
                Pedido #{pedido.id} - {formatearFecha(pedido.fechaPedido)}
              </h3>

              <label className="flex items-center space-x-2">

                <input
                  type="checkbox"
                  checked={seleccionados.includes(pedido.id)}
                  onChange={() => toggleSeleccion(pedido.id)}
                />
                <span>Seleccionar</span>

                 <span>  </span>
                  <span>  </span>
              { pedido.estado === "pendiente" ? (
                  <button
                    onClick={() => handleEditarPedido(pedido.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    {loading ? "Cargando..." : <FaRegEdit className="text-lg" />}
                  </button>


             ) : ("") }

              { pedido.estado === "pendiente" ? (
                  <button
                    onClick={() => onCancelarPedido(pedido.id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    {loading ? "Cargando..." : <FaTrash className="text-lg" />}
                  </button>


             ) : ("") }

              </label>




            </div>

            <p><strong>Cliente:</strong> {pedido.clienteNombre}</p>
            <p><strong>RUC:</strong> {pedido.cliente?.ruc}</p>
            <p><strong>Ciudad:</strong> {pedido.cliente?.ciudad}</p>
            <p><strong>Dirección:</strong> {pedido.cliente?.direccion}</p>
           {pedido.observaciones && pedido.observaciones.trim() !== "" && (
            <div className="bg-yellow-100 p-2 rounded-md mt-2">
              <p>
                <strong>Observaciones:</strong> {pedido.observaciones}
              </p>
            </div>
            )}

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
            <p><strong>Vendedor:</strong> {pedido.vendedorNombre || "No asignado"}</p>
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

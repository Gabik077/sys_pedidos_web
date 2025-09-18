"use client";

import { useEffect, useState } from "react";
import { finalizarPedidoSalon, getPedidos, updateEstadoPedido } from "@/app/services/pedidosService";
import { Pedido } from "../../../types";
import { FaCheck, FaDraft2Digital, FaEdit, FaRegEdit, FaSave, FaSyncAlt, FaTrash } from "react-icons/fa";
import { useUser } from "@/app/context/UserContext";
import { formatearFecha } from "@/app/utils/utils";
import { handleImprimirPedidosSeleccionados } from "../empresion/handleImprimirPedidosSeleccionados";
import { handleImprimirProductosSeleccionados } from "../empresion/handleImprimirProductosSeleccionados";
import InputModal from "@/app/components/modalConInput";
import DropdownTipoPedidos from "./dropDownTipoPedidos";
import DropdownTipoPedidosPendientes from "./dropdownTipoPedidosPendientes";

export default function PedidosPendientesView() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState<number | null>(0);
  const [tipoVenta, setTipoVenta] = useState<{ id: number; nombre: string }[]>([]);
  const [tipoOrigen, setTipoOrigen] = useState<string>("venta");
  const [tipoPedidoSeleccionado, setTipoPedidoSeleccionado] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState("");
  const { token } = useUser();

  if (!token) {
    window.location.href = "/login";
    return null;
  }

      const handleConfirm = (password: string) => {
        if (password === "1234.") {
          handleCancelarPedido(pedidoToDelete || 0);
        } else {
          alert("Contraseña incorrecta ❌");
        }

        setIsModalOpen(false);
    };


  const handleFinalizarPedidoSalon = async (pedidoId: number) => {

if (confirm(`¿Estás seguro de que deseas finalizar el pedido #${pedidoId}?.`)) {
    try {
      const res = await finalizarPedidoSalon(token, {id_pedido: pedidoId});
      if (res.status === 'ok') {
        alert('Pedido finalizado correctamente');
        fetchPedidos(tipoPedidoSeleccionado);

      } else {
        alert('Error al finalizar el pedido');
      }
    } catch (err) {
      console.error(err);
      alert('Error en el servidor');
    }

}

  };

  const fetchPedidos = async (tipoPedido: number) => {
    setLoading(true);
    try {
      const pedidos = await getPedidos(token, "pendiente");
      const pedidosFilteredTipoPedido = pedidos.filter((p: { tipoPedido: { id: number; }; }) => p.tipoPedido?.id === tipoPedido);
      setPedidos(pedidosFilteredTipoPedido);
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
  setPedidoToDelete(pedidoId);
  setIsModalOpen(true);
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
      setPedidos(pedidos.filter((p: { tipoPedido: { id: number; }; }) => p.tipoPedido?.id === tipoPedidoSeleccionado));
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
  const handleTipoPedidoSelect = (id: number) => {
      setTipoPedidoSeleccionado(id);
      fetchPedidos(id);
  }

  useEffect(() => {
        fetchPedidos(1); // Cargar tipo delivery por defecto
  }, []);


    const filteredPedidos = pedidos.filter((p) =>
    `${p.clienteNombre} ${p.cliente?.apellido} ${p.cliente?.nombre} ${p.cliente?.ciudad} ${p.cliente?.zona?.nombre}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pedidosList = filteredPedidos;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-500">Pedidos</h2>
         <input
            type="text"
            placeholder="Cliente/Ciudad/Zona"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="w-full md:w-40 p-1.5 border rounded"
          />
        <div>

      <DropdownTipoPedidosPendientes  onSelect={(id) => handleTipoPedidoSelect(id)} />
        </div>
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
        <p><strong>Pedidos: {pedidos.length}</strong></p>
        <button
          title="Actualizar Pendientes"
          onClick={() => fetchPedidos(tipoPedidoSeleccionado)}
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
        {pedidosList.map((pedido) => (
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
              { pedido.tipoPedido?.id === 2 && pedido.estado === "pendiente" ? (
                  <button
                    onClick={() => handleFinalizarPedidoSalon(pedido.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {loading ? "Cargando..." : <FaCheck className="text-lg" />}
                  </button>


             ) : ("") }

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
            <p><strong>Tipo Pedido:</strong> {pedido.tipoPedido?.nombre}</p>
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
             <InputModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
                message="Ingresar contraseña para cancelar el pedido"
              />
    </div>
  );
}

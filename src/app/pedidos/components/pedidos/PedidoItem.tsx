"use client";

import { formatearFecha } from "@/app/utils/utils";
import { Pedido } from "../../../types";
import { FC, useState } from "react";

interface Props {
  pedido: Pedido;
  seleccionado: boolean;
  onToggle: () => void;
}

const PedidoItem: FC<Props> = ({ pedido, seleccionado, onToggle }) => {
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const detallesMostrados = mostrarTodos
    ? pedido.detalles
    : pedido.detalles.slice(0, 2);

  return (
    <div className="border p-4 rounded shadow relative">
      <div className="absolute top-2 right-2">
        <span
          className={`px-2 py-1 rounded text-sm font-semibold text-white
            ${
              pedido.estado === "pendiente"
                ? "bg-orange-500"
                : pedido.estado === "entregado"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
        >
          {pedido.estado}
        </span>
      </div>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={seleccionado}
          onChange={onToggle}
          className="mt-1"
        />
        <div>
          <h3 className="font-bold">
            Pedido #{pedido.id} -{" "}
            {formatearFecha(pedido.fechaPedido)}
          </h3>
          <p>
            <strong>Cliente:</strong> {pedido.clienteNombre} ({pedido.cliente?.ruc})
          </p>
          <p>
            <strong>Dirección:</strong> {pedido.cliente?.direccion} -{" "}
            {pedido.cliente?.ciudad}
          </p>
          <p>
            <strong>Observaciones:</strong>{" "}
            {pedido.observaciones || "Sin observaciones"}
          </p>
          <p>
            <strong>Vendedor:</strong>{" "}
            {pedido.vendedorNombre || "Sin vendedor asignado"}
          </p>
          <p>
            <strong>Total:</strong>{" "}
            {Number(pedido.total).toLocaleString("es-PY", {
              style: "currency",
              currency: "PYG",
            })}
          </p>

          <div className="mt-2">
            <strong>Productos:</strong>
            <ul className="pl-5 list-disc">
              {detallesMostrados.map((d) => (
                <li key={d.id}>
                  {d.producto?.nombre} - Cant: {d.cantidad} - Precio Unit:{" "}
                  {Number(d.precioUnitario).toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                  })}
                </li>
              ))}
            </ul>

            {/* Ver más / Ver menos */}
            {pedido.detalles.length > 2 && (
              <button
                type="button"
                onClick={() => setMostrarTodos(!mostrarTodos)}
                className="text-gray-500 mt-2 hover:underline text-sm"
              >
                {mostrarTodos ? "Ver menos" : "Ver más..."}
              </button>
            )}
          </div>
        </div>
      </label>
    </div>
  );
};

export default PedidoItem;

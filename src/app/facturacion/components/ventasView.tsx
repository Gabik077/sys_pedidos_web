"use client";

import { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { useUser } from "@/app/context/UserContext";

export default function VentasView() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("TODAS");
const [totalVentas, setTotalVentas] = useState<number>(0);
  const { token } = useUser();

  if (!token) {
    window.location.href = "/login";
    return null;
  }


  const fetchVentas = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/stock/ventas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVentas(data);
    } catch (err) {
      console.error("Error al obtener ventas:", err);
    } finally {
      setLoading(false);
    }
  };

  const ventasFiltradas =
    filtroEstado === "TODAS"
      ? ventas
      : ventas.filter((v) => v.estado === filtroEstado);

  useEffect(() => {
    fetchVentas();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-500">Lista de Ventas</h2>

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="TODAS">Todas</option>
          <option value="completada">Completadas</option>
          <option value="pendiente">Pendientes</option>
          <option value="cancelada">Canceladas</option>
        </select>

        <h1 className="text-lg font-semibold text-gray-600">
          <strong>Cantidad Total: {ventasFiltradas.length}</strong>
        </h1>

        <h1 className="text-lg font-semibold text-gray-600">
          <strong>Monto Total: {ventasFiltradas.reduce((acc, venta) => {
            const total = venta.salida_stock_general?.salidas?.reduce((sum: number, salida: any) => {
              return sum + (salida.producto?.precio_venta * salida.cantidad || 0);
            }, 0) || 0;
            return acc + total;
          }, 0).toLocaleString("es-PY", { style: "currency", currency: "PYG" })}</strong>
        </h1>

        <button
          title="Actualizar Ventas"
          onClick={fetchVentas}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Cargando..." : <FaSyncAlt className="text-lg" />}
        </button>
      </div>

      <div className="space-y-4 text-gray-700">
        {ventasFiltradas.map((venta) => (
          <div
            key={venta.id}
            className="border p-4 mb-6 rounded shadow bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-600">
                Venta #{venta.id} -{" "}
                {new Date(venta.fecha_venta).toLocaleString("es-PY")}
              </h3>
              <span
                className={`px-2 py-1 rounded font-semibold text-white ${
                  venta.estado === "completada"
                    ? "bg-green-600"
                    : venta.estado === "pendiente"
                    ? "bg-orange-500"
                    : venta.estado === "cancelada"
                    ? "bg-red-500"
                    : "bg-gray-400"
                }`}
              >
                {venta.estado}
              </span>
            </div>

            <p>
              <strong>Método de pago:</strong> {venta.metodo_pago}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              {venta.salida_stock_general?.salidas?.reduce((acc: number, salida: any) => {
               // setTotalVentas(totalVentas + (acc + (salida.producto?.precio_venta * salida.cantidad || 0)));
                return acc + (salida.producto?.precio_venta * salida.cantidad || 0);
              }, 0).toLocaleString("es-PY", {
                style: "currency",
                currency: "PYG",
              })}
            </p>


            <h4 className="mt-4 font-semibold">Productos</h4>
            <ul className="pl-4 list-disc">
              {venta.salida_stock_general?.salidas?.map((salida: any) => (
                <li key={salida.id}>
                  {salida.producto?.nombre} - Cant: {salida.cantidad} - Precio:{" "}
                  {Number(salida.producto?.precio_venta).toLocaleString(
                    "es-PY",
                    { style: "currency", currency: "PYG" }
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

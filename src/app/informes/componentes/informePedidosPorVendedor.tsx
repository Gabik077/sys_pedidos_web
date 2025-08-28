"use client";

import { useEffect, useState } from "react";
import { FaSyncAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useUser } from "@/app/context/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchPedidosPorVendedor } from "@/app/services/pedidosService";
import { PedidoPorVendedor } from "@/app/types";

export default function InformePedidosPorVendedor() {
  const [pedidosPorVendedor, setPedidosPorVendedor] = useState<PedidoPorVendedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroFecha, setFiltroFecha] = useState(new Date());
  const [filtroFechaFin, setFiltroFechaFin] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { token } = useUser();

  if (!token) {
    window.location.href = "/login";
    return null;
  }

  const getVentas = async () => {
    setLoading(true);
    try {
      if (!filtroFecha || !filtroFechaFin) {
        alert("Por favor, selecciona una fecha válida.");
        return;
      }

      const fecha = filtroFecha.toLocaleDateString("en-CA"); // yyyy-mm-dd
      const fechaFin = filtroFechaFin.toLocaleDateString("en-CA");

      const data = await fetchPedidosPorVendedor(token, fecha, fechaFin);

      if (!Array.isArray(data)) {
        alert("Error: " + data.message);
        setPedidosPorVendedor([]);
        return;
      }
      setPedidosPorVendedor(data);
    } catch (err) {
      console.error("Error al obtener ventas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVentas();
  }, []);

  const filteredPedidos = pedidosPorVendedor.filter((p) =>
    `${p.vendedorNombre} }`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);
  const paginatedPedidos = filteredPedidos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-500">Pedidos por Vendedor</h2>

        <div className="flex gap-2 items-center">
          <span>Desde:</span>
          <DatePicker
            selected={filtroFecha}
            onChange={(date) => date && setFiltroFecha(date)}
            dateFormat="dd/MM/yyyy"
          />
          <span>Hasta:</span>
          <DatePicker
            selected={filtroFechaFin}
            onChange={(date) => date && setFiltroFechaFin(date)}
            dateFormat="dd/MM/yyyy"
          />

          <button
            title="Actualizar Ventas"
            onClick={getVentas}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Cargando..." : <FaSyncAlt className="text-lg" />}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar pedido..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-64 p-2 border rounded"
        />

        <h1 className="text-lg font-semibold text-gray-600">
          <strong>
            Cantidad:{" "}
            {filteredPedidos
              .reduce((acc, pedido) => acc + Number(pedido.cantidadPedidos || 0), 0)
              .toLocaleString()}
          </strong>
        </h1>
      </div>

      {filteredPedidos.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-blue-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">#</th>
                <th className="py-3 px-6 text-left">Vendedor</th>
                <th className="py-3 px-6 text-left">Cantidad Pedidos</th>
                <th className="py-3 px-6 text-left">Monto Total</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {paginatedPedidos.map((pedido, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6">{i + 1}</td>
                  <td className="py-3 px-6">{pedido.vendedorNombre || "Sin Vendedor"}</td>
                  <td className="py-3 px-6">
                    {Number(pedido.cantidadPedidos || 0)}
                  </td>
                    <td className="py-3 px-6">
                        {Number(pedido.montoTotal || 0).toLocaleString("es-PY", {
                        style: "currency",
                        currency: "PYG",
                        })}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              <FaChevronLeft className="text-sm" />
              <span className="text-sm font-medium">Anterior</span>
            </button>

            <span className="text-sm text-gray-600 font-medium">
              Página <span className="font-semibold text-gray-900">{currentPage}</span> de{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
            >
              <span className="text-sm font-medium">Siguiente</span>
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

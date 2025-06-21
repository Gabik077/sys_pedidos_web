"use client";

import { useState, useEffect } from "react";
import { fetchStockList } from "@/app/services/stockService"; // Asegúrate de que esta ruta sea correcta
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface StockItem {
  id: number;
  cantidad_disponible: number;
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
    precio_compra: string;
    precio_venta: string;
  };
}

export default function StockView() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetchStockList();
        setStockItems(response);
      } catch (error) {
        console.error("Error al cargar el stock:", error);
      }
    };
    fetchStock();
  }, []);

  const filteredItems = stockItems.filter((item) =>
    item.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl text-gray-400 font-bold">Stock Disponible</h1>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-64 p-2 border rounded"
        />
      </div>

      {filteredItems.length === 0 ? (
        <p className="mt-4">No hay productos registrados en el stock.</p>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-md mt-6">
            <thead>
              <tr className="bg-blue-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Cantidad</th>
                <th className="py-3 px-6 text-left">Precio Compra</th>
                <th className="py-3 px-6 text-left">Precio Venta</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {paginatedItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{item.producto.nombre}</td>
                  <td className="py-3 px-6 text-left">{item.cantidad_disponible}</td>
                  <td className="py-3 px-6 text-left">{item.producto.precio_compra}</td>
                  <td className="py-3 px-6 text-left">{item.producto.precio_venta}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-4 mt-6">
  {/* Botón anterior */}
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={currentPage === 1}
  >
    <FaChevronLeft className="text-sm" />
    <span className="text-sm font-medium">Anterior</span>
  </button>

  {/* Indicador de página */}
  <span className="text-sm text-gray-600 font-medium">
    Página <span className="font-semibold text-gray-900">{currentPage}</span> de{" "}
    <span className="font-semibold text-gray-900">{totalPages}</span>
  </span>

  {/* Botón siguiente */}
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
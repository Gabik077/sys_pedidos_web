"use client";

import { useState, useEffect } from "react";
import { fetchStockList, updateStockItem } from "@/app/services/stockService";
import { FaChevronLeft, FaChevronRight, FaEdit, FaSave } from "react-icons/fa";
import ConfirmModal from "@/app/components/confirmModal";
import { UserProvider, useUser } from  "@/app/context/UserContext";
import { numberFormatter, priceFormatter } from "@/app/utils/utils";



interface StockItem {
  id: number;
  cantidad_disponible: number;
  cantidad_reservada: number;
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
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editCantidad, setEditCantidad] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSaveItem, setPendingSaveItem] = useState<StockItem | null>(null);
  const { token } = useUser();


  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetchStockList(token || "");
        setStockItems(response);
      } catch (error) {
        console.error("Error al cargar el stock:", error);
      }
    };
    fetchStock();
  }, []);

  const handleSave = (item: StockItem) => {
    setPendingSaveItem(item);
    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    if (pendingSaveItem) {
      try {
        await updateStockItem(pendingSaveItem.id, { cantidad_disponible: editCantidad });
        setStockItems((prev) =>
          prev.map((i) =>
            i.id === pendingSaveItem.id ? { ...i, cantidad_disponible: editCantidad } : i
          )
        );
        setEditItemId(null);
        setPendingSaveItem(null);
        setShowConfirmModal(false);
      } catch (error) {
        console.error("Error al actualizar el stock:", error);
      }
    }
  };

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
                <th className="py-3 px-6 text-left">Cantidad reservada</th>
                <th className="py-3 px-6 text-left">Precio Compra</th>
                <th className="py-3 px-6 text-left">Precio Venta</th>
                <th className="py-3 px-6 text-left">Acción</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {paginatedItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{item.producto.nombre}</td>
                  <td className="py-3 px-6 text-left">
                    {editItemId === item.id ? (
                      <input
                        type="number"
                        value={editCantidad}
                        onChange={(e) => setEditCantidad(Number(e.target.value))}
                        className="w-20 p-1 border rounded"
                      />
                    ) : (
                      item.cantidad_disponible
                    )}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {numberFormatter.format(item.cantidad_reservada)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {priceFormatter.format(Number(item.producto.precio_compra))}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {priceFormatter.format(Number(item.producto.precio_venta))}
                  </td>

                  <td className="py-3 px-6 text-left">
                    {editItemId === item.id ? (
                      <button
                        onClick={() => handleSave(item)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaSave />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditItemId(item.id);
                          setEditCantidad(item.cantidad_disponible);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                    )}
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
              Página <span className="font-semibold text-gray-900">{currentPage}</span> de {" "}
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

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setPendingSaveItem(null);
        }}
        onConfirm={confirmSave}
        message="¿Estás seguro de que deseas guardar los cambios?"
      />
    </div>
  );
}

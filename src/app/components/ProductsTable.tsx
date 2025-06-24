"use client";

import { useState } from "react";
import Link from "next/link";
import ConfirmModal from "./confirmModal";
import { deleteProduct } from "../services/productService";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_venta: string;
}

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products: initialProducts }: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedProductName, setSelectedProductName] = useState<string | null>(null);

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteClick = (productId: number,name: string) => {
    setSelectedProductId(productId);
    setSelectedProductName(name);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProductId !== null) {
      await deleteProduct(selectedProductId);
      const updatedProducts = products.filter((product) => product.id !== selectedProductId);
      setProducts(updatedProducts);
      setIsModalOpen(false);
      setSelectedProductId(null);
      if ((currentPage - 1) * itemsPerPage >= updatedProducts.length) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white p-6">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      <h1 className="text-2xl text-gray-500 font-bold">Lista de Productos</h1>
      <div className="flex gap-4 w-full md:w-auto">
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

  <Link href="/products/create">
  <button className="bg-gray-400 text-white p-2 rounded w-full md:w-auto">➕ Crear Producto</button>
  </Link>
  </div>
</div>


      {filteredProducts.length === 0 ? (
        <p className="mt-4">No hay productos registrados.</p>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-md mt-6">
            <thead>
              <tr className="bg-blue-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Descripción</th>
                <th className="py-3 px-6 text-left">Precio Venta</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{product.nombre}</td>
                  <td className="py-3 px-6 text-left">{product.descripcion}</td>
                  <td className="py-3 px-6 text-left">{product.precio_venta}</td>
                  <td className="py-3 px-6 text-center flex gap-2">
                    <Link href={`/products/edit/${product.id}`}>
                      <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-sm hover:shadow-md"><FaEdit className="text-white" /> Editar</button>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(product.id,product.nombre)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-sm hover:shadow-md">
                      <FaTrash className="text-white" /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}

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

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message={`¿Estás seguro de que quieres eliminar el producto "${selectedProductName ?? ''}"?`}
      />
    </div>
  );
}

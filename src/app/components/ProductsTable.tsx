// app/components/ProductsTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import ConfirmModal from "./confirmModal";
import { deleteProduct } from "../services/productService";

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

  const handleDeleteClick = (productId: number) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProductId !== null) {
      await deleteProduct(selectedProductId);
      setProducts(products.filter((product) => product.id !== selectedProductId));
      setIsModalOpen(false);
      setSelectedProductId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div>
        <h1 className="text-2xl text-black font-bold mb-4">Lista de Productos</h1>
        <Link href="/products/create">
          <button className="mt-6 bg-gray-400 text-white p-2 rounded">➕ Crear Producto</button>
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
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
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{product.nombre}</td>
                <td className="py-3 px-6 text-left">{product.descripcion}</td>
                <td className="py-3 px-6 text-left">{product.precio_venta}</td>
                <td className="py-3 px-6 text-center flex gap-2">
                  <Link href={`/products/edit/${product.id}`}>
                    <button className="bg-yellow-500 text-white p-2 rounded">✏️ Editar</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(product.id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="¿Estás seguro de que quieres eliminar este producto?"
      />
    </div>
  );
}

'use client';

import { useState } from "react";
import Link from "next/link";
import ConfirmModal from "./confirmModal";
import { deleteVendedor } from "../services/vendedorService";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import { Vendedor } from "../types";



interface Props {
  vendedores: Vendedor[];
}

export default function VendedoresTable({ vendedores: initialVendedores }: Props) {
  const [vendedores, setVendedores] = useState(initialVendedores);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const itemsPerPage = 10;
  const { token } = useUser();

  if (!token) {
    window.location.href = "/login";
    return null;
  }

  const handleDelete = async () => {
    if (selectedId !== null) {
      await deleteVendedor(token, selectedId);
      const updated = vendedores.filter(v => v.id !== selectedId);
      setVendedores(updated);
      setIsModalOpen(false);
      setSelectedId(null);
      if ((currentPage - 1) * itemsPerPage >= updated.length) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const filtered = vendedores.filter(v =>
    `  ${v.nombre.toLowerCase()} ${v.apellido.toLowerCase()} ${v.cedula.toLowerCase()}`.includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between mb-4 flex-col md:flex-row gap-4">
        <h1 className="text-2xl font-bold text-gray-600">Lista de Vendedores</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por nombre..."
            className="w-full md:w-64 p-2 border rounded"
          />
          <Link href="/vendedores/create">
            <button className="bg-gray-400 text-white p-2 rounded">➕ Crear Vendedor</button>
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p>No hay vendedores registrados.</p>
      ) : (
        <>
          <table className="w-full border shadow">
            <thead>
              <tr className="bg-blue-200 text-left text-sm text-gray-600 uppercase">
                <th className="py-3 px-6">Nombre</th>
                <th className="py-3 px-6">Apellido</th>
                <th className="py-3 px-6">Cedula</th>
                <th className="py-3 px-6">Teléfono</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((v) => (
                <tr key={v.id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-6">{v.nombre}</td>
                  <td className="py-3 px-6">{v.apellido}</td>
                  <td className="py-3 px-6">{v.cedula}</td>
                  <td className="py-3 px-6">{v.telefono}</td>
                  <td className="py-3 px-6 text-center flex gap-2 justify-center">
                    <Link href={`/vendedores/edit/${v.id}`}>
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        <FaEdit /> Editar
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedId(v.id);
                        setIsModalOpen(true);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </td>
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

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message="¿Estás seguro de que quieres eliminar este vendedor?"
      />
    </div>
  );
}

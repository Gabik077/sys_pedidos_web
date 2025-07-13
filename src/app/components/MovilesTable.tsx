"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import ConfirmModal from "./confirmModal";
import { fetchMoviles, deleteMovil } from "../services/stockService"; // Asegurate de tener deleteMovil implementado

interface Movil {
  id: number;
  nombreChofer: string;
  chapaMovil: string;
  tipoMovil: string;
  nombreMovil: string;
}

export default function MovilesTable() {
  const [moviles, setMoviles] = useState<Movil[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovilId, setSelectedMovilId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMoviles();
      setMoviles(data);
    };
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return moviles.filter((m) =>
      m.nombreMovil.toLowerCase().includes(search.toLowerCase()) ||
      m.nombreChofer.toLowerCase().includes(search.toLowerCase()) ||
      m.chapaMovil.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, moviles]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDeleteClick = (id: number) => {
    setSelectedMovilId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedMovilId !== null) {
      await deleteMovil(selectedMovilId);
      setMoviles(moviles.filter((m) => m.id !== selectedMovilId));
      setIsModalOpen(false);
      setSelectedMovilId(null);

      // Ajustar página si es necesario
      if ((page - 1) * pageSize >= moviles.length - 1) {
        setPage((prev) => Math.max(prev - 1, 1));
      }
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl text-gray-500 font-bold">Lista de Móviles</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar móvil..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-64 p-2 border rounded"
          />
          <Link href="/moviles/create">
            <button className="bg-gray-400 text-white p-2 rounded w-full md:w-auto">➕ Crear Móvil</button>
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p>No hay móviles registrados.</p>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead className="bg-blue-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Nombre Móvil</th>
                <th className="py-3 px-6 text-left">Nombre Chofer</th>
                <th className="py-3 px-6 text-left">Chapa</th>
                <th className="py-3 px-6 text-left">Tipo</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {paginated.map((movil) => (
                <tr key={movil.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{movil.nombreMovil}</td>
                  <td className="py-3 px-6 text-left">{movil.nombreChofer}</td>
                  <td className="py-3 px-6 text-left">{movil.chapaMovil}</td>
                  <td className="py-3 px-6 text-left">{movil.tipoMovil}</td>
                  <td className="py-3 px-6 text-center flex justify-center gap-2">
                    <Link href={`/moviles/edit/${movil.id}`}>
                      <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-sm hover:shadow-md">
                        <FaEdit className="text-white" /> Editar
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(movil.id)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-sm hover:shadow-md"
                    >
                      <FaTrash className="text-white" /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === 1}
            >
              <FaChevronLeft className="text-sm" />
              <span className="text-sm font-medium">Anterior</span>
            </button>
            <span className="text-sm text-gray-600 font-medium">
              Página <span className="font-semibold text-gray-900">{page}</span> de <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === totalPages}
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
        message="¿Estás seguro de que quieres eliminar este móvil?"
      />
    </div>
  );
}

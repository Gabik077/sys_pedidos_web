"use client";

import { useState } from "react";
import Link from "next/link";
import ConfirmModal from "./confirmModal";
import { deleteCliente } from "../services/clientService";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  ruc: string;
  direccion: string;
  ciudad: string;
  lat: number;
  lon: number;
}

interface ClientesTableProps {
  clientes: Cliente[];
}

export default function ClientesTable({ clientes: initialClientes }: ClientesTableProps) {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");


  const handleDeleteClick = (clienteId: number) => {
    setSelectedClienteId(clienteId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedClienteId !== null) {
      await deleteCliente(selectedClienteId);
      const updatedClientes = clientes.filter((c) => c.id !== selectedClienteId);
      setClientes(updatedClientes);
      setIsModalOpen(false);
      setSelectedClienteId(null);
      if ((currentPage - 1) * itemsPerPage >= updatedClientes.length) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const filteredClientes = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const paginatedClientes = filteredClientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl text-gray-500 font-bold">Lista de Clientes</h1>
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
          <Link href="/clients/create">
            <button className="bg-gray-400 text-white p-2 rounded w-full md:w-auto">
              ➕ Crear Cliente
            </button>
          </Link>
        </div>
      </div>

      {filteredClientes.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-blue-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Apellido</th>
                <th className="py-3 px-6 text-left">Teléfono</th>
                <th className="py-3 px-6 text-left">RUC</th>
                <th className="py-3 px-6 text-left">Ciudad</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {paginatedClientes.map((cliente) => (
                <tr key={cliente.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{cliente.nombre}</td>
                  <td className="py-3 px-6 text-left">{cliente.apellido}</td>
                  <td className="py-3 px-6 text-left">{cliente.telefono}</td>
                  <td className="py-3 px-6 text-left">{cliente.ruc}</td>
                  <td className="py-3 px-6 text-left">{cliente.ciudad}</td>
                  <td className="py-3 px-6 text-center flex gap-2">
                    <Link href={`/clients/edit/${cliente.id}`}>
                      <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-sm hover:shadow-md">
                        <FaEdit className="text-white" /> Editar
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(cliente.id)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-sm hover:shadow-md">
                      <FaTrash className="text-white" /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}>
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
              disabled={currentPage === totalPages}>
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
        message="¿Estás seguro de que quieres eliminar este cliente?"
      />
    </div>
  );
}

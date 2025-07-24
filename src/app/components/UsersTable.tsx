"use client";

import { useState } from "react";
import Link from "next/link";
import ConfirmModal from "./confirmModal";
import { deleteUser } from "../services/userService";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import { useUser } from "../context/UserContext";
interface User {
  id: number;
  nombre: string;
  email: string;
  rol: {
    descripcion: string;
  };
}

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
    const { token } = useUser();

        if(!token) {
          window.location.href = "/login";
          return null; // Evitar renderizado adicional si no hay token
        }

  const handleDeleteClick = (userId: number) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUserId !== null) {
      await deleteUser(token,selectedUserId);
      const updatedUsers = users.filter((user) => user.id !== selectedUserId);
      setUsers(updatedUsers);
      setIsModalOpen(false);
      setSelectedUserId(null);
      if ((currentPage - 1) * itemsPerPage >= updatedUsers.length) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl text-gray-500 font-bold">Lista de Usuarios</h1>
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
          <Link href="/users/create">
            <button className="bg-gray-400 text-white p-2 rounded w-full md:w-auto">➕ Crear Usuario</button>
          </Link>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-blue-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Rol</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{user.nombre}</td>
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-left">{user.rol.descripcion}</td>
                  <td className="py-3 px-6 text-center flex gap-2">
                    <Link href={`/users/edit/${user.id}`}>
                      <button
                      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-sm hover:shadow-md" > <FaEdit className="text-white"/> Editar</button>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(user.id)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-sm hover:shadow-md">
                      <FaTrash className="text-white" />
                      Eliminar
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
        message="¿Estás seguro de que quieres eliminar este usuario?"
      />
    </div>
  );
}

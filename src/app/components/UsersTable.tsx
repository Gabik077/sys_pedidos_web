"use client";

import { useState } from "react";
import Link from "next/link";
import ConfirmModal from "./confirmModal";
import { deleteUser } from "../services/userService";

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

  const handleDeleteClick = (userId: number) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUserId !== null) {
      await deleteUser(selectedUserId);
      setUsers(users.filter((user) => user.id !== selectedUserId));
      setIsModalOpen(false);
      setSelectedUserId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white-200 p-6">
      <div>
        <h1 className="text-2xl text-black font-bold mb-4">Lista de Usuarios</h1>
        <Link href="/users/create">
          <button className="mt-6 bg-gray-400 text-white p-2 rounded">➕ Crear Usuario</button>
        </Link>
      </div>

      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 shadow-md mt-6">
          <thead>
            <tr className="bg-blue-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Nombre</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Rol</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{user.nombre}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-left">{user.rol.descripcion}</td>
                <td className="py-3 px-6 text-center flex gap-2">
                  <Link href={`/users/edit/${user.id}`}>
                    <button className="bg-yellow-500 text-white p-2 rounded">✏️ Editar</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(user.id)}
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
        message="¿Estás seguro de que quieres eliminar este usuario?"
      />
    </div>
  );
}

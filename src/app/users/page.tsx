"use client";

import { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../services/userService";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Eliminar usuario
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("¿Estás seguro de que quieres eliminar este usuario?");
    if (confirmDelete) {
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => user.id !== id)); // Actualiza la lista eliminando el usuario
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white-200 p-6">
      <h1 className="text-2xl text-black font-bold mb-4">Lista de Usuarios</h1>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
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
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{user.nombre}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-left">{user.rol}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

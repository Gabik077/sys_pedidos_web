"use client";

import { updateUserById, fetchRoles, fetchUserById } from "@/app/services/userService";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams(); // Obtiene el ID del usuario desde la URL
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState(""); // Guardamos el ID del rol como string
  const [roles, setRoles] = useState<{ id: number; descripcion: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserAndRoles = async () => {
      try {
        const [user, rolesData] = await Promise.all([
          fetchUserById(id),
          fetchRoles(),
        ]);

        if (!user) {
          console.error("Error: Usuario no encontrado.");
          return;
        }

        setNombre(user.nombre || "");
        setEmail(user.email || "");

        // Verificamos si user.rol existe y asignamos su ID como string
        if (user.rol && user.rol.id !== undefined) {
          setRol(String(user.rol.id));
        } else {
          console.warn("Advertencia: user.rol no está definido correctamente.");
        }

        setRoles(Array.isArray(rolesData) ? rolesData : []);
      } catch (error) {
        console.error("Error al cargar usuario y roles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndRoles();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = { nombre, email, rol };
    const res = await updateUserById(id, updatedUser);

    if (res.status === "ok") {
      alert("Usuario actualizado con éxito");
      router.push("/users"); // Redirige a la lista de usuarios
    } else {
      alert("Error al actualizar usuario");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Editar Usuario</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-3 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Rol</label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full p-3 border rounded"
                required
              >
                <option value="">Seleccionar Rol</option>
                {roles.map((r) => (
                  <option key={r.id} value={String(r.id)}>
                    {r.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
              Guardar Cambios
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

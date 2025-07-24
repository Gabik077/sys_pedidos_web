"use client";

import { updateUserById, fetchRoles, fetchUserById } from "@/app/services/userService";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";


function EditUserPage() {
  const router = useRouter();
  const { id } = useParams(); // Obtiene el ID del usuario desde la URL
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState(""); // Guardamos el ID del rol como string
  const [roles, setRoles] = useState<{ id: number; descripcion: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useUser();

      if(!token) {
        window.location.href = "/login";
        return null; // Evitar renderizado adicional si no hay token
      }

  useEffect(() => {
    const loadUserAndRoles = async () => {
      try {
        const [user, rolesData] = await Promise.all([
          fetchUserById(token,id),
          fetchRoles(token),
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
    const res = await updateUserById(token,id, updatedUser);

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
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Nombre</p>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div className="col-span-2">
            <p className="text-xs text-gray-500">Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div className="col-span-2">
            <p className="text-xs text-gray-500">Rol</p>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full p-3 border rounded bg-white"
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

          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </form>


        )}
      </div>
    </div>
  );
}

export default EditUserPage;
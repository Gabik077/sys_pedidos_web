'use client';

import { createUser, fetchRoles } from "@/app/services/userService";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { withAuth } from "@/app/utils/withAuth";

function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [rol, setRol] = useState("");
  const [roles, setRoles] = useState<{ id: number; descripcion: string }[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await fetchRoles();
        if (Array.isArray(data)) {
          setRoles(data);
        } else {
          console.error("La API no devolvió un array:", data);
          setRoles([]);
        }
      } catch (error) {
        console.error("Error al cargar roles:", error);
      } finally {
        setLoading(false);
      }
    };



    loadRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");

    const newUser = { nombre, username, email, contrasena, rol };
    const res = await createUser(newUser);

    if (res.status === "ok") {
      alert("Usuario creado con éxito");
      router.push("/users"); // Redirige a la lista de usuarios
    } else {
      alert("Error al crear usuario");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Crear Usuario</h1>
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

          <div>
            <p className="text-xs text-gray-500">Username</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">Contraseña</p>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">Confirmar Contraseña</p>
            <input
              type="password"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div className="col-span-2">
            <p className="text-xs text-gray-500">Rol</p>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full p-3 border rounded"
              required
            >
              <option value="">Seleccionar Rol</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.descripcion}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="col-span-2 text-red-500 text-sm">{error}</p>
          )}

          <button type="submit" className="col-span-2 bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
            Crear Usuario
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(CreateUserPage, ["ADMINISTRADOR"]);
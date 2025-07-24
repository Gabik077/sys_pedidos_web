'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getMovilById, updateMovilById } from "@/app/services/stockService";
import { MovilPedido } from "@/app/types";
import { useUser } from "@/app/context/UserContext";

export default function EditMovilPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const [nombreMovil, setNombreMovil] = useState("");
  const [nombreChofer, setNombreChofer] = useState("");
  const [chapaMovil, setChapaMovil] = useState("");
  const [telefonoChofer, setTelefonoChofer] = useState("");
      const { token } = useUser();

      if (!token) {
        window.location.href = "/login";
        return null; // Evitar renderizado adicional si no hay token
      }

  useEffect(() => {
    if (!id) return;
    const fetchMovil = async () => {
      const movil = await getMovilById(token, id as string);
      if (movil) {
        setNombreMovil(movil.nombreMovil);
        setNombreChofer(movil.nombreChofer);
        setChapaMovil(movil.chapaMovil);
        setTelefonoChofer(movil.telefonoChofer);
      }
    };
    fetchMovil();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedMovil: MovilPedido = {
      nombreMovil,
      nombreChofer,
      chapaMovil,
      telefonoChofer,
    };

    try {
      const res = await updateMovilById(token,id, updatedMovil);
      if (res.status === "ok") {
        alert("Móvil actualizado con éxito");
        router.push("/moviles");
      } else {
        alert(res.message || "Error al actualizar el móvil");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el móvil");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Editar Móvil</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <p className="text-xs text-gray-500">Nombre del Móvil</p>
            <input
              type="text"
              value={nombreMovil}
              onChange={(e) => setNombreMovil(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">Nombre del Chofer</p>
            <input
              type="text"
              value={nombreChofer}
              onChange={(e) => setNombreChofer(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">Chapa del Móvil</p>
            <input
              type="text"
              value={chapaMovil}
              onChange={(e) => setChapaMovil(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">Teléfono del Chofer</p>
            <input
              type="text"
              value={telefonoChofer}
              onChange={(e) => setTelefonoChofer(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-yellow-700"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}

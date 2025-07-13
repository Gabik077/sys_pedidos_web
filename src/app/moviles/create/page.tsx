'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMovil } from "@/app/services/stockService";


export default function CreateMovilPage() {
  const router = useRouter();

  const [nombreMovil, setNombreMovil] = useState("");
  const [nombreChofer, setNombreChofer] = useState("");
  const [chapaMovil, setChapaMovil] = useState("");
  const [telefonoChofer, setTelefonoChofer] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoMovil = {
      id: 0, // el backend puede ignorar o sobrescribir esto
      nombreMovil,
      nombreChofer,
      chapaMovil,
      telefonoChofer,
    };

    try {
      const res = await createMovil(nuevoMovil);
      if (res.status === "ok") {
        alert("Móvil creado con éxito");
        router.push("/moviles");
      } else {
        alert(res.message || "Error al crear el móvil");
      }
    } catch (error) {
      console.error("Error al crear móvil:", error);
      alert("Error al crear el móvil");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Crear Móvil</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Crear Móvil
          </button>
        </form>
      </div>
    </div>
  );
}

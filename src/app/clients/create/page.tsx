"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { withAuth } from "@/app/utils/withAuth";
import { createCliente } from "@/app/services/clientService";

function CreateClientePage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ruc, setRuc] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLat = lat.trim() ? parseFloat(lat.replace(/,/g, ".")) : null;
    const parsedLon = lon.trim() ? parseFloat(lon.replace(/,/g, ".")) : null;

    const newCliente = {
      nombre,
      apellido,
      telefono,
      ruc,
      direccion,
      ciudad,
      lat: parsedLat, // Aseguramos que la latitud y longitud sean números decimales
      lon: parsedLon // Aseguramos que la latitud y longitud sean números decimales
    };

    try {
      const res = await createCliente(newCliente);
      if (res.status === "ok") {
        alert("Cliente creado con éxito");
        router.push("/clients");
      } else {
        alert("Error al crear cliente");
      }
    } catch (err) {
      console.error("Error al crear cliente:", err);
      alert("Ocurrió un error inesperado");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Crear Cliente</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
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
            <p className="text-xs text-gray-500">Apellido</p>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">Teléfono</p>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">RUC</p>
            <input
              type="text"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <div className="col-span-2">
            <p className="text-xs text-gray-500">Dirección</p>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <div className="col-span-2">
            <p className="text-xs text-gray-500">Ciudad</p>
            <input
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">Latitud</p>
            <input
              type="text"
              inputMode="decimal"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">Longitud</p>
            <input
             type="text"
             inputMode="decimal"
             value={lon}
              onChange={(e) => setLon(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Crear Cliente
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(CreateClientePage, ["ADMINISTRADOR"]);

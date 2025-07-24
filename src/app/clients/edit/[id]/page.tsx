"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchClienteById, updateCliente } from "@/app/services/clientService";
import { useUser } from "@/app/context/UserContext";

function EditClientePage() {
  const router = useRouter();
  const { id } = useParams(); // Obtiene el ID del usuario desde la URL


  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ruc, setRuc] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [email, setEmail] = useState("");
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
    const { token } = useUser();

    if(!token) {
      window.location.href = "/login";
      return null; // Evitar renderizado adicional si no hay token
    }

  useEffect(() => {
    const fetchCliente = async () => {
      if (!id) return;
      try {
        const cliente = await fetchClienteById(token,id as string);
        if (cliente) {
          setNombre(cliente.nombre);
          setApellido(cliente.apellido);
          setTelefono(cliente.telefono);
          setRuc(cliente.ruc);
          setDireccion(cliente.direccion);
          setCiudad(cliente.ciudad);
          setEmail(cliente.email ?? "");
          setLat(cliente.lat?.toString().replace(/,/g, ".") ?? "");
          setLon(cliente.lon?.toString().replace(/,/g, ".") ?? "");
        }
      } catch (err) {
        console.error("Error al cargar cliente:", err);
      }
    };

    fetchCliente();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const parsedLat = lat.trim() ? parseFloat(lat.replace(/,/g, ".")) : null;
    const parsedLon = lon.trim() ? parseFloat(lon.replace(/,/g, ".")) : null;

    const updatedCliente = {
      nombre,
      apellido,
      telefono,
      ruc,
      direccion,
      email,
      ciudad,
      lat: parsedLat,
      lon: parsedLon,
    };

    try {
      const res = await updateCliente(token,id as String, updatedCliente);
      if (res.status === "ok") {
        alert("Cliente actualizado con éxito");
        router.push("/clients");
      } else {
        alert("Error al actualizar cliente");
      }
    } catch (err) {
      console.error("Error al actualizar cliente:", err);
      alert("Ocurrió un error inesperado");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Editar Cliente</h1>
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
            <p className="text-xs text-gray-500">Email</p>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Actualizar Cliente
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditClientePage;

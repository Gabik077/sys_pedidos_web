"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { createVendedor } from "@/app/services/vendedorService";

function CreateVendedorPage() {
  const router = useRouter();
  const { token } = useUser();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [comision, setComision] = useState(0);
  const [telefono, setTelefono] = useState("");

  if (!token) {
    window.location.href = "/login";
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !apellido || !cedula || comision < 0) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (telefono && !/^\d+$/.test(telefono)) {
      alert("El teléfono solo debe contener números.");
      return;
    }
    if (cedula && !/^\d+$/.test(cedula)) {
      alert("La cédula solo debe contener números.");
      return;
    }
    if (comision < 0 || comision > 100) {
      alert("La comisión debe estar entre 0 y 100.");
      return;
    }

    const nuevoVendedor = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      cedula: cedula.trim(),
      telefono: telefono.trim(),
      comision: Number(comision)
    };

    try {
      const res = await createVendedor(token, nuevoVendedor);

      if (res.status === "ok") {
        alert("Vendedor creado con éxito");
        router.push("/vendedores");
      } else {
        alert("Error al crear vendedor");
      }
    } catch (error) {
      console.error("Error al crear vendedor:", error);
      alert("Error inesperado");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Crear Vendedor</h1>
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
            <p className="text-xs text-gray-500">Apellido</p>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div className="col-span-2">
            <p className="text-xs text-gray-500">Cédula</p>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Teléfono</p>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Comisión (%)</p>
            <input
              type="number"
              value={comision}
              onChange={(e) => setComision(Number(e.target.value))}
              className="w-full p-3 border rounded"
              min={0}
              step={1}
              required
            />
          </div>


          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Crear Vendedor
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateVendedorPage;

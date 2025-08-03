"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { fetchVendedorById, updateVendedor } from "@/app/services/vendedorService";

function EditVendedorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useUser();

      if (!token) {
        window.location.href = "/login";
        return null;
      }

  const [loading, setLoading] = useState(true);
  const [vendedor, setVendedor] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    comision: 0
  }) ;

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const loadVendedor = async () => {
      try {
        const data = await fetchVendedorById(token, id);
        setVendedor(data);
      } catch (error) {
        console.error("Error al cargar vendedor:", error);
        alert("No se pudo cargar el vendedor.");
        router.push("/vendedores");
      } finally {
        setLoading(false);
      }
    };

    loadVendedor();
  }, [id]);

  const handleChange = (field: string, value: any) => {
    if (field === "telefono") {
      value = value.replace(/[^0-9]/g, ""); // Permitir solo números
    }
    if (field === "cedula") {
      value = value.replace(/[^0-9]/g, ""); // Permitir solo números
    }
    if (field === "comision") {
      value = Number(value);
    }
    if (field === "comision") {//permitir solo números enteros
      value = Math.floor(value);
    }
    if (field === "nombre" || field === "apellido") {
      value = value.trim(); // Eliminar espacios en blanco al inicio y al final
    }
    setVendedor((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await updateVendedor(token, id, vendedor);

      if (res.status === "ok") {
        alert("Vendedor actualizado con éxito");
        router.push("/vendedores");
      } else {
        alert("Error al actualizar vendedor");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error inesperado");
    }
  };

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Editar Vendedor</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Nombre</p>
            <input
              type="text"
              value={vendedor.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div className="col-span-2">
            <p className="text-xs text-gray-500">Apellido</p>
            <input
              type="text"
              value={vendedor.apellido}
              onChange={(e) => handleChange("apellido", e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div className="col-span-2">
            <p className="text-xs text-gray-500">Cédula</p>
            <input
              type="text"
              value={vendedor.cedula}
              onChange={(e) => handleChange("cedula", e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

         <div className="col-span-2">
            <p className="text-xs text-gray-500">Teléfono</p>
            <input
              type="text"
              value={vendedor.telefono || ""}
              onChange={(e) => handleChange("telefono", e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div className="col-span-2">
            <p className="text-xs text-gray-500">Comisión (%)</p>
            <input
              type="number"
              value={vendedor.comision}
              onChange={(e) => handleChange("comision", Number(e.target.value))}
              className="w-full p-3 border rounded"
              required
            />
          </div>



          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditVendedorPage;

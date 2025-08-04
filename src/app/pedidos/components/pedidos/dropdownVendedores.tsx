// components/DropdownMovil.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { Vendedor } from "@/app/types";
import { fetchVendedores } from "@/app/services/vendedorService";



interface Props {
  onSelect: (id: number) => void;
}

export default function DropdownVendedores({ onSelect }: Props) {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [vendedorId, setVendedorId] = useState<number | null>(null);
  const { token } = useUser();

    if (!token) {
      window.location.href = "/login";
      return null; // Evitar renderizado adicional si no hay token
    }

  useEffect(() => {
    const getVendedores = async () => {
      try {
        const vendedores = await fetchVendedores(token);
        setVendedores(vendedores.data);
      } catch (error) {
        console.error("Error al cargar vendedores:", error);
      }
    };
    getVendedores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setVendedorId(id);
    onSelect(id);
  };

  return (
    <div>
      <select style={{ maxWidth: "220px", width: "100%" }}
        value={vendedorId ?? ""}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      >
        <option value="" disabled>
          Seleccionar Vendedor
        </option>
        {vendedores.map((vendedor) => (
          <option key={vendedor.id} value={vendedor.id}>
            {vendedor.nombre} {vendedor.apellido}
          </option>
        ))}
      </select>
    </div>
  );
}

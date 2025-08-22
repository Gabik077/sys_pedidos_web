// components/DropdownMovil.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchMoviles } from "@/app/services/pedidosService";
import { useUser } from "@/app/context/UserContext";

interface Movil {
  id: number;
  nombreChofer: string;
  chapaMovil: string;
  tipoMovil: string;
  nombreMovil: string;
}

interface Props {
  onSelect: (id: number) => void;
}

export default function DropdownMovil({ onSelect }: Props) {
  const [moviles, setMoviles] = useState<Movil[]>([]);
  const [movilId, setMovilId] = useState<number | null>(null);
    const { token } = useUser();

    if (!token) {
      window.location.href = "/login";
      return null; // Evitar renderizado adicional si no hay token
    }

  useEffect(() => {
    const getMoviles = async () => {
      try {
        const data = await fetchMoviles(token);
        setMoviles(data);
      } catch (error) {
        console.error("Error al cargar móviles:", error);
      }
    };
    getMoviles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setMovilId(id);
    onSelect(id);
  };

  return (
    <div>
      <select
        value={movilId ?? ""}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2  md:w-36"
      >
        <option value="" disabled>
          Sel. Móvil
        </option>
        {moviles.map((movil) => (
          <option key={movil.id} value={movil.id}>
            {movil.nombreMovil} - {movil.nombreChofer}
          </option>
        ))}
      </select>
    </div>
  );
}

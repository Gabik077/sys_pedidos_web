// components/DropdownMovil.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { Ciudad } from "@/app/types";
import { fetchCiudades } from "@/app/services/clientService";



interface Props {
  onSelect: (id: number,nombre: string) => void;
}

export default function DropdownCiudad({ onSelect }: Props) {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [ciudadString, setCiudad] = useState<string | null>(null);
  const { token } = useUser();

    if (!token) {
      window.location.href = "/login";
      return null; // Evitar renderizado adicional si no hay token
    }

  useEffect(() => {
    const getCiudades = async () => {
      try {
        const data = await fetchCiudades(token);
        setCiudades(data);
      } catch (error) {
        console.error("Error al cargar ciudades:", error);
      }
    };
    getCiudades();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCiudad(e.target.value);
    onSelect(0, e.target.value);
  };

  return (
    <div>
      <select
        value={ciudadString ?? ""}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2  md:w-36"
      >
        <option value="todas" key="todas">
          Todas las Ciudades
        </option>
        {ciudades.map((ciudad) => (
          <option key={ciudad.nombre} value={ciudad.nombre}>
            {ciudad.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

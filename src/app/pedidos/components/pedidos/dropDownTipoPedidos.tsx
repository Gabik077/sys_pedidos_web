// components/DropdownMovil.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { TipoPedido, Vendedor } from "@/app/types";
import { fetchTipoPedido } from "@/app/services/pedidosService";


interface Props {
  onSelect: (id: number) => void;
}

export default function DropdownTipoPedidos({ onSelect }: Props) {
  const [tiposPedidos, setTiposPedidos] = useState<TipoPedido[]>([]);
  const [tipoPedidoId, setTipoPedidoId] = useState<number | null>(null);
  const { token } = useUser();

    if (!token) {
      window.location.href = "/login";
      return null; // Evitar renderizado adicional si no hay token
    }

  useEffect(() => {
    const getTipoPedido = async () => {
      try {
        const tipos = await fetchTipoPedido(token);
        setTiposPedidos(tipos);
      } catch (error) {
        console.error("Error al cargar tipos de pedido:", error);
      }
    };
    getTipoPedido();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setTipoPedidoId(id);
    onSelect(id);
  };

  return (
    <div>
      <select style={{ maxWidth: "220px", width: "100%" }}
        value={tipoPedidoId ?? ""}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      >
        <option value="" disabled>
          Seleccionar Tipo Pedido
        </option>
        {tiposPedidos.map((tipo) => (
          <option key={tipo.id} value={tipo.id}>
            {tipo.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

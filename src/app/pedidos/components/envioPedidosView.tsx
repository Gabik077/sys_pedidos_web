"use client";

import { useEffect, useState } from "react";
import { getPedidos } from "@/app/services/stockService";
import dynamic from "next/dynamic";
import DropdownMovil from "./DropdownMovil";
import PedidoItem from "./PedidoItem";
import ListaRutaOrdenada from "./ListaRutaOrdenada";
import { Pedido } from "./types";

const MapaConPedidos = dynamic(() => import("./MapaConPedidos"), {
  ssr: false,
});


export default function EnvioPedidosView() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosSeleccionados, setPedidosSeleccionados] = useState<Pedido[]>([]);
  const [movilSeleccionado, setMovilSeleccionado] = useState<number | null>(null);
  const [origenLat, setOrigenLat] = useState<string>("-25.377676990645696");// Valor por defecto
  const [origenLon, setOrigenLon] = useState<string>("-57.570087369311956"); // Valor por defecto

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const pedidos = await getPedidos();
        setPedidos(pedidos);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
      }
    };

    fetchPedidos();
  }, []);

  const togglePedido = (pedido: Pedido) => {
    setPedidosSeleccionados((prev) => {
      if (prev.find((p) => p.id === pedido.id)) {
        return prev.filter((p) => p.id !== pedido.id);
      }
      return [...prev, pedido];
    });
  };

  const handleGuardarEnvio = () => {
    if (!movilSeleccionado || !origenLat || !origenLon || pedidosSeleccionados.length === 0) {
      alert("Completa todos los campos y selecciona al menos un pedido.");
      return;
    }

    const data = {
      id_movil: movilSeleccionado,
      origen: { lat: origenLat, lon: origenLon },
      pedidos: pedidosSeleccionados.map((p) => p.id),
    };

    console.log("Guardando envío:", data);
    // Aquí deberías hacer la llamada a la API para guardar el envío
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Armado de Envío</h2>

      <div className="mb-4 flex flex-col md:flex-row gap-4 items-center">
        <DropdownMovil onSelect={(id) => setMovilSeleccionado(id)} />
        <input
          type="text"
          placeholder="Latitud de origen"
          value={origenLat}
          onChange={(e) => setOrigenLat(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-64"
        />
        <input
          type="text"
          placeholder="Longitud de origen"
          value={origenLon}
          onChange={(e) => setOrigenLon(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-64"
        />
        <button
          onClick={handleGuardarEnvio}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar Envío
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="max-h-[75vh] overflow-y-auto space-y-4">
          {pedidos.map((pedido) => (
            <PedidoItem
              key={pedido.id}
              pedido={pedido}
              seleccionado={pedidosSeleccionados.some((p) => p.id === pedido.id)}
              onToggle={() => togglePedido(pedido)}
            />
          ))}
        </div>

        <div className="h-[75vh]">
          <MapaConPedidos
            pedidos={pedidosSeleccionados}
            origen={{ lat: parseFloat(origenLat), lng: parseFloat(origenLon) }}
          />
        </div>
      </div>

      <div className="mt-6">
        <ListaRutaOrdenada
          pedidos={pedidosSeleccionados}
          origen={{ lat: parseFloat(origenLat), lng: parseFloat(origenLon) }}
        />
      </div>
    </div>
  );
}

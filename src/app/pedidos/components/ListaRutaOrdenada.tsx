// components/ListaRutaOrdenada.tsx
"use client";

import { useEffect, useState } from "react";
import { Pedido } from "./types";

interface Props {
  pedidos: Pedido[];
  origen: { lat: number; lng: number };
}

interface RutaItem {
  pedido: Pedido;
  distanciaTexto: string;
  duracionTexto: string;
  orden: number;
}

export default function ListaRutaOrdenada({ pedidos, origen }: Props) {
  const [rutaOrdenada, setRutaOrdenada] = useState<RutaItem[]>([]);

  useEffect(() => {
    if (!window.google || pedidos.length === 0 || !origen.lat || !origen.lng) return;

    const service = new google.maps.DistanceMatrixService();

    const destinos = pedidos.map((p) => new google.maps.LatLng(p.cliente.lat, p.cliente.lon));

    service.getDistanceMatrix(
      {
        origins: [new google.maps.LatLng(origen.lat, origen.lng)],
        destinations: destinos,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK" && response?.rows && response.rows.length > 0) {
          const resultados = response.rows[0].elements;

          const combinados: RutaItem[] = pedidos.map((pedido, index) => ({
            pedido,
            distanciaTexto: resultados[index].distance?.text || "",
            duracionTexto: resultados[index].duration?.text || "",
            orden: 0,
          }));

          // Ordenar de menor a mayor distancia
          combinados.sort((a, b) => {
            const da = resultados[pedidos.indexOf(a.pedido)].distance?.value || 0;
            const db = resultados[pedidos.indexOf(b.pedido)].distance?.value || 0;
            return da - db;
          });

          // Asignar número de orden
          combinados.forEach((item, i) => (item.orden = i + 1));

          setRutaOrdenada(combinados);
        }
      }
    );
  }, [pedidos, origen]);

  if (rutaOrdenada.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Ruta Ordenada</h3>
      <ul className="space-y-2">
        {rutaOrdenada.map((item) => (
          <li key={item.pedido.id} className="border p-3 rounded shadow">
            <div className="font-semibold">
              #{item.orden} - {item.pedido.clienteNombre}
            </div>
            <div>{item.pedido.cliente.direccion}, {item.pedido.cliente.ciudad}</div>
            <div className="text-sm text-gray-600">
              Distancia: {item.distanciaTexto} - Duración: {item.duracionTexto}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Pedido } from "./types";

interface Props {
  pedidos: Pedido[]; // ya vienen en orden correcto
  origen: { lat: number; lng: number };
  calcularRuta: boolean;
}

interface Tramo {
  clienteNombre?: string; // opcional si no se usa
  desde: string;
  hasta: string;
  direccion?: string; // opcional si no se usa
  pedidoNro?: number; // opcional si no se usa
  distancia: string;
  duracion: string;
  distanciaValor: number;
  duracionValor: number;
}

export default function ListaRutaOrdenada({ pedidos, origen, calcularRuta }: Props) {
  const [tramos, setTramos] = useState<Tramo[]>([]);
  const [totales, setTotales] = useState<{ distancia: string; duracion: string }>({ distancia: "", duracion: "" });

  useEffect(() => {
    if (!calcularRuta || !window.google || pedidos.length === 0 || !origen.lat || !origen.lng) return;

    // Puntos: origen + todos los pedidos
    const puntos = [
      { lat: origen.lat, lng: origen.lng },
      ...pedidos.map((p) => ({ lat: p.cliente.lat, lng: p.cliente.lon })),
    ];

    const origins = puntos.slice(0, -1).map((p) => new google.maps.LatLng(p.lat, p.lng));
    const destinations = puntos.slice(1).map((p) => new google.maps.LatLng(p.lat, p.lng));

    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins,
        destinations,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === "OK" && response?.rows) {
          const elementos = response.rows.map((row, i) => row.elements[i]);

          const nuevosTramos: Tramo[] = elementos.map((elem, i) => ({
            clienteNombre: pedidos[i]?.clienteNombre,
            desde: i === 0 ? "Origen" : pedidos[i - 1].clienteNombre,
            hasta: pedidos[i].clienteNombre,
            direccion: pedidos[i].cliente.direccion,
            pedidoNro: pedidos[i].id,
            distancia: elem.distance?.text || "-",
            duracion: elem.duration?.text || "-",
            distanciaValor: elem.distance?.value || 0,
            duracionValor: elem.duration?.value || 0,
          }));

          const distanciaTotal = nuevosTramos.reduce((sum, t) => sum + t.distanciaValor, 0);
          const duracionTotal = nuevosTramos.reduce((sum, t) => sum + t.duracionValor, 0);

          setTramos(nuevosTramos);
          setTotales({
            distancia: (distanciaTotal / 1000).toFixed(2) + " km",
            duracion: Math.round(duracionTotal / 60) + " min",
          });
        } else {
          console.error("Error al obtener distancia:", status, response);
        }
      }
    );
  }, [calcularRuta, pedidos, origen]);

  if (tramos.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Ruta Ordenada</h3>
      <ul className="space-y-2 text-sm">
        {tramos.map((t, i) => (
          <li key={i} className="border p-3 rounded shadow bg-white">
            <strong>#{i + 1}. {t.clienteNombre}</strong><br />
            Dirección: {t.direccion || "No disponible"}<br />
            Tramo: {t.desde} → {t.hasta}<br />
            Distancia: {t.distancia} - Duración: {t.duracion}
          </li>
        ))}
      </ul>
      <div className="mt-4 text-base font-semibold text-gray-700">
        🧭 Distancia total: {totales.distancia} | ⏱️ Tiempo total: {totales.duracion}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { Pedido } from "../../../types";

interface Props {
  pedidos: Pedido[];
  origen: { lat: number; lng: number };
  calcularRuta: boolean;
  onTotalesCalculados?: (totales: { distancia: string; duracion: string }) => void;
  onRutaOptimizada?: (pedidosOrdenados: Pedido[]) => void;
}

export default function ListaRutaOrdenada({ pedidos, origen, calcularRuta, onTotalesCalculados, onRutaOptimizada }: Props) {
  const [totales, setTotales] = useState<{ distancia: string; duracion: string }>({ distancia: "", duracion: "" });
  const [loading, setLoading] = useState(false);
  const [pedidosOrdenados, setPedidosOrdenados] = useState<Pedido[]>([]);
  const listaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (listaRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Ruta Optimizada</title>
              <style>
                body { font-family: sans-serif; padding: 20px; }
                .pedido { margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; border-radius: 6px; }
                .totales { font-weight: bold; margin-top: 20px; }
              </style>
            </head>
            <body>
              ${listaRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleVerEnGoogleMaps = () => {
    const waypoints = [
      `${origen.lat},${origen.lng}`,
      ...pedidosOrdenados.map(p => `${p.cliente.lat},${p.cliente.lon}`),
      `${origen.lat},${origen.lng}`
    ];
    const url = `https://www.google.com/maps/dir/${waypoints.join("/")}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (!calcularRuta || pedidos.length === 0) return;

    const fetchRuta = async () => {
      setLoading(true);

      const coords = pedidos.map((p) => `${p.cliente.lon},${p.cliente.lat}`).join(";");
      const url = `https://router.project-osrm.org/trip/v1/driving/${coords}?source=first&destination=last&roundtrip=true&overview=false`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === "Ok" && data.trips.length > 0) {
          const trip = data.trips[0];
          const orden = data.waypoints
            .sort((a: any, b: any) => a.waypoint_index - b.waypoint_index)
            .map((wp: any) => wp.waypoint_index);

          const pedidosOrden = orden.map((i: number) => pedidos[i]);

          setPedidosOrdenados(pedidosOrden);

          const distanciaTotal = trip.distance;
          const duracionTotal = trip.duration;

          const horas = Math.floor(duracionTotal / 3600);
          const minutos = Math.round((duracionTotal % 3600) / 60);

          const totales = {
            distancia: (distanciaTotal / 1000).toFixed(2) + " km",
            duracion: horas > 0 ? `${horas}h ${minutos}min` : `${minutos} min`
          };

          setTotales(totales);
          onTotalesCalculados?.(totales);
          onRutaOptimizada?.(pedidosOrden);
        }
      } catch (error) {
        console.error("Error al calcular ruta optimizada:", error);
      }

      setLoading(false);
    };

    fetchRuta();
  }, [calcularRuta, pedidos, origen]);

  if (loading) {
    return <div className="mt-6 text-gray-500 text-sm">⏳ Calculando ruta optimizada...</div>;
  }

  if (!totales.distancia && !totales.duracion) return null;

  return (
    <div className="mt-6" ref={listaRef}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-500">Ruta Optimizada</h3>
        <div className="flex gap-2">
          <button
            onClick={handleVerEnGoogleMaps}
            className="px-4 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700 shadow"
          >
            📍 Ver en Google Maps
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 shadow"
          >
            🖨️ Imprimir
          </button>
        </div>
      </div>
      <ul className="space-y-2 text-sm text-gray-700">
        <li className="border p-3 rounded shadow bg-white">
          <strong>Inicio</strong><br />
          Latitud: {origen.lat}, Longitud: {origen.lng}
        </li>
        {pedidosOrdenados.map((p, i) => (
          <li key={i} className="border p-3 rounded shadow bg-white">
            <strong>#{i + 1}. {p.clienteNombre}</strong><br />
            Pedido N°: {p.id}
          </li>
        ))}
        <li className="border p-3 rounded shadow bg-white">
          <strong>Final</strong><br />
          Latitud: {origen.lat}, Longitud: {origen.lng}
        </li>
      </ul>
      <div className="mt-4 text-base font-semibold text-gray-700">
        🧭 Distancia total: {totales.distancia} | ⏱️ Tiempo total: {totales.duracion}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { Pedido } from "../../../types";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

  // ✅ CORREGIDO: hooks fuera del JSX
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

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
    const pointsLimit = 25;
    const totalPuntos = pedidosOrdenados.length + 1;

    if (totalPuntos > pointsLimit) {
      alert("⚠️ Google Maps permite como máximo 25 puntos (incluyendo origen y destino). Solo se mostrarán los primeros 23 pedidos.");
    }

    const pedidosLimitados = pedidosOrdenados.slice(0, pointsLimit - 1);
    const intermedios = pedidosLimitados.slice(0, -1);
    const destino = pedidosLimitados[pedidosLimitados.length - 1];

    const waypoints = [
      `${origen.lat},${origen.lng}`,
      ...intermedios.map(p => `${p.cliente.lat},${p.cliente.lon}`),
      `${destino.cliente.lat},${destino.cliente.lon}`
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
          console.log("pedidosOrden:", pedidosOrden);
        }
      } catch (error) {
        console.error("Error al calcular ruta optimizada:", error);
      }

      setLoading(false);
    };

    fetchRuta();
  }, [calcularRuta, pedidos, origen]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = pedidosOrdenados.findIndex(p => p.id === active.id);
      const newIndex = pedidosOrdenados.findIndex(p => p.id === over?.id);

      const pedidosReordenados = arrayMove(pedidosOrdenados, oldIndex, newIndex);
      setPedidosOrdenados(pedidosReordenados);
      onRutaOptimizada?.(pedidosReordenados);
      console.log("nuevo orden:", pedidosReordenados);
    }
  };

  if (loading) {
    return <div className="mt-6 text-gray-500 text-sm">⏳ Calculando ruta optimizada...</div>;
  }

  if (!totales.distancia && !totales.duracion) return null;

  return (
    <div className="mt-6" ref={listaRef}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-500">
          Ruta Optimizada ({pedidosOrdenados.length + 1}/25 puntos)
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleVerEnGoogleMaps}
            className="px-4 py-1 text-sm rounded bg-green-700 text-white hover:bg-green-800 shadow"
          >
            Ver en Google Maps
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1 text-sm rounded bg-blue-400 text-white hover:bg-blue-500 shadow"
          >
            Imprimir
          </button>
        </div>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pedidosOrdenados.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="border p-3 rounded shadow bg-white">
              <strong>Inicio</strong><br />
              Latitud: {origen.lat}, Longitud: {origen.lng}
            </li>
            {pedidosOrdenados.map((p, i) => (
              <SortableItem key={p.id} pedido={p} index={i} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="mt-4 text-base font-semibold text-gray-700">
        🧭 Distancia total: {totales.distancia} | ⏱️ Tiempo total: {totales.duracion} (sin tráfico)
      </div>
      <br />
    </div>
  );
}

function SortableItem({ pedido, index }: { pedido: Pedido; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: pedido.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border p-3 rounded shadow bg-white cursor-move"
    >
      <strong>#{index + 1}. {pedido.clienteNombre}</strong><br />
      Pedido N°: {pedido.id}<br />
      Ciudad: {pedido.cliente.ciudad} - Dirección : {pedido.cliente.direccion}<br />
      Latitud: {pedido.cliente.lat}, Longitud: {pedido.cliente.lon}
    </li>
  );
}

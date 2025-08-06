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
/*function coordsMatch(lat1: number, lon1: number, lat2: number, lon2: number, epsilon = 0.0002): boolean {
  return Math.abs(lat1 - lat2) < epsilon && Math.abs(lon1 - lon2) < epsilon;
}*/

function coordsMatch(lat1: number, lon1: number, lat2: number, lon2: number, toleranceInMeters = 100): boolean {
  return haversineDistance(lat1, lon1, lat2, lon2) < toleranceInMeters;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
}


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

const pedidosConOrigen = [...pedidos]; // evitar mutar el original si lo necesitas más adelante

pedidosConOrigen.unshift({
  id: 0,
  fechaPedido: "",
  estado: "",
  total: "",
  clienteNombre: "",
  observaciones: "",
  responsable: "",
  cliente: {
    id: 0,
    nombre: "ORIGEN",
    apellido: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    ruc: "",
    lat: origen.lat,
    lon: origen.lng
  },
  detalles: []
});

  useEffect(() => {

    if (!calcularRuta || pedidos.length === 0) return;

    const fetchRuta = async () => {
      setLoading(true);


    const coords = [
  `${origen.lng},${origen.lat}`, // origen
  ...pedidos.map((p) => `${p.cliente.lon},${p.cliente.lat}`)
].join(";");

console.log("Calculando ruta para coords:", coords);

const url = `https://router.project-osrm.org/trip/v1/driving/${coords}?source=first&roundtrip=false`;

try {
  const res = await fetch(url);
  const data = await res.json();

  if (data.code === "Ok" && data.trips.length > 0) {
    const trip = data.trips[0];

    console.log("data.waypoints:", data.waypoints);

    console.log("Orden de visita según OSRM (con nombre de cliente):");

    const newList: any[] = [];

data.waypoints
  .sort((a: { waypoint_index: number; }, b: { waypoint_index: number; }) => a.waypoint_index - b.waypoint_index)
  .forEach((wp: any, i: number) => {
    const wpLat = Number(wp.location[1]);
    const wpLon = Number(wp.location[0]);

    const pedido = pedidosConOrigen.find(p =>
      coordsMatch(Number(p.cliente.lat), Number(p.cliente.lon), wpLat, wpLon)
    );


console.log(`Pedido encontrado: ${pedidosConOrigen[i].cliente.nombre}  clienteCoords: ${pedidosConOrigen[i]?.cliente.lat},${pedidosConOrigen[i]?.cliente.lon} wpCoords: ${wpLat},${wpLon}`);

    const nombreCliente = pedido?.cliente?.nombre || 'ORIGEN';

    console.log(
      `Visita #${i}: Cliente "${nombreCliente}" - coords: ${wpLat},${wpLon} clienteCoords: ${pedido?.cliente.lat},${pedido?.cliente.lon}`
    );

    if (nombreCliente !== 'ORIGEN') {
      newList.push({
        id: `waypoint-${i}`,
        lat: wpLat,
        lon: wpLon,
        waypoint_index: i,
        pedido
      });
    }
  });

// Ahora tenés pedidos optimizados
const pedidosOrden = newList.map((wp) => wp.pedido);


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
               <strong>#1 Inicio</strong><br />
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
      <strong>#{index + 2}. {pedido.clienteNombre}</strong><br />
      Pedido N°: {pedido.id}<br />
      Ciudad: {pedido.cliente.ciudad} - Dirección : {pedido.cliente.direccion}<br />
      Latitud: {pedido.cliente.lat}, Longitud: {pedido.cliente.lon}
    </li>
  );
}

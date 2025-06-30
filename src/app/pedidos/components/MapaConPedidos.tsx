"use client";

import { useEffect, useRef } from "react";

interface Cliente {
  lat: number;
  lon: number;
  nombre: string;
  direccion: string;
}

interface Pedido {
  id: number;
  cliente: Cliente;
}

interface Props {
  pedidos: Pedido[];
  origen: { lat: number; lng: number };
}

export default function MapaConPedidos({ pedidos, origen }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);


  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    if (!mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: origen,
        zoom: 12,
      });
      directionsService.current = new google.maps.DirectionsService();
      directionsRenderer.current = new google.maps.DirectionsRenderer({ suppressMarkers: false });
      directionsRenderer.current.setMap(mapInstance.current);
    }

    if (pedidos.length > 0 && origen.lat && origen.lng) {
      const waypoints = pedidos.map((pedido) => ({
        location: new google.maps.LatLng(pedido.cliente.lat, pedido.cliente.lon),
        stopover: true,
      }));

      directionsService.current!.route(
        {
          origin: new google.maps.LatLng(origen.lat, origen.lng),
          destination: waypoints[waypoints.length - 1].location,
          waypoints: waypoints.slice(0, -1),
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
        },
        (result, status) => {
          if (status === "OK" && result) {
            directionsRenderer.current!.setDirections(result);
          } else {
            console.error("Error al calcular ruta:", status);
          }
        }
      );
    }
  }, [pedidos, origen]);

  return <div ref={mapRef} className="w-full h-full rounded shadow" />;
}

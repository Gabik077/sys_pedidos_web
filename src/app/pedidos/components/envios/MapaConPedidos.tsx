"use client";

import { useEffect, useRef, useState } from "react";

import { Pedido } from "../../../types";



interface Props {
  pedidos: Pedido[];
  origen: { lat: number; lng: number };
  calcularRuta: boolean;
  onOrdenOptimizado?: (pedidosOrdenados: Pedido[]) => void;
}

export default function MapaConPedidos({ pedidos, origen, calcularRuta ,onOrdenOptimizado}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);


  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById("google-maps-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.onload = () => setIsMapReady(true);
        document.body.appendChild(script);
      } else {
        setIsMapReady(true);
      }
    };

    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (isMapReady && window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -25.2637, lng: -57.5759 },
        zoom: 12,
      });
    }
  }, [isMapReady]);


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


  }, [isMapReady, origen]);

  useEffect(() => {
    if (!calcularRuta || !window.google || !directionsService.current || !directionsRenderer.current) return;
    const offsetLng = origen.lng + 0.00045; // ≈ 50m al este


    if (pedidos.length > 0 && origen.lat && origen.lng) {
        const waypoints = pedidos.map((pedido) => ({
          location: new google.maps.LatLng(pedido.cliente.lat, pedido.cliente.lon),
          stopover: true,
        }));

        directionsService.current!.route(
          {
            origin: new google.maps.LatLng(origen.lat, origen.lng),
            destination: new google.maps.LatLng(origen.lat, offsetLng),
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true,
          },
          (result, status) => {
            if (status === "OK" && result) {
              directionsRenderer.current!.setDirections(result);
              const ordenOptimizado = result.routes[0].waypoint_order;
              console.log("Orden optimizado:", ordenOptimizado);
          // Mapear con pedidos[ordenOptimizado[i]] para ver en qué orden visitar los puntos
          const pedidosOrdenados = ordenOptimizado.map((i) => pedidos[i]);
          onOrdenOptimizado?.(pedidosOrdenados);

            } else {
              console.error("Error al calcular ruta:", status);
            }
          }
        );
      }

    // lógica para construir waypoints y hacer la llamada a DirectionsService
  }, [calcularRuta]);


  return <div ref={mapRef} className="w-full h-full rounded shadow" />;
}

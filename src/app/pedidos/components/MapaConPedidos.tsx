"use client";

import { useEffect, useRef, useState } from "react";

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
  calcularRuta: boolean;
}

export default function MapaConPedidos({ pedidos, origen, calcularRuta }: Props) {
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
    if (isMapReady && window.google && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: -25.2637, lng: -57.5759 },//default center
          zoom: 12,
        });

      }

  }, []);


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


  }, [isMapReady, calcularRuta, origen]);

  useEffect(() => {
    if (!calcularRuta || !window.google || !directionsService.current || !directionsRenderer.current) return;


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

    // lógica para construir waypoints y hacer la llamada a DirectionsService
  }, [calcularRuta]);


  return <div ref={mapRef} className="w-full h-full rounded shadow" />;
}

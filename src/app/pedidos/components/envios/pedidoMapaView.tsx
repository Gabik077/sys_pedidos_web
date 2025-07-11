"use client";

import { useEffect, useRef, useState } from "react";

export default function PedidosMap() {
  const mapRef = useRef<HTMLDivElement>(null);
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
        zoom: 13,
      });

      new window.google.maps.Marker({
        position: { lat: -25.2637, lng: -57.5759 },
        map,
        title: "Ubicación inicial",
      });
    }
  }, [isMapReady]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pedidos en Mapa</h1>
      <div
        ref={mapRef}
        className="w-full h-[500px] border rounded shadow"
      ></div>
    </div>
  );
}

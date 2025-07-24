"use client"; // Necesario para manejar estado en App Router

import { useEffect, useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);  // Marca cuando el componente está montado en el cliente
    setLoading(false); // Inicia el estado de carga
  }, []);

    if (!isMounted) {
       return null; // Evita que el componente se renderice en el servidor
      }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del
    setLoading(true);
     const res = await fetch("/api/me", {
      body: JSON.stringify({ username, password }),
       method: "POST"
    });
    const data = await res.json();

    if (data.status === "ok") {
      if (typeof window !== "undefined") { // Verificamos que estamos en el cliente
        window.location.href = "/"; // Redirige a la ruta raíz
      }

    }else {
      alert(data.message);
    }

    setLoading(false);
  };

return loading ? (
    <div className="flex items-center justify-center h-screen bg-white-100">Cargando...</div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-white-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl text-black font-bold mb-4">Iniciar Sesión</h1>
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 text-black border mb-3"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 text-black border mb-3"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2">
          Iniciar Sesión
        </button>
      </form>
    </div>);



}

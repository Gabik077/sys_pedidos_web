"use client"; // Necesario para manejar estado en App Router

import { useEffect, useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);  // Marca cuando el componente está montado en el cliente
  }, []);

    if (!isMounted) {
       return null; // Evita que el componente se renderice en el servidor
      }


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del

    // Llamada al backend NestJS para autenticar usuario
    const res = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
       const data = await res.json();

      if (data.status === "ok") {

        if (typeof window !== "undefined") { // Verificamos que estamos en el cliente
          window.location.href = "/"; // Redirige a la ruta raíz
        }

      }else {
        alert(data.message);
      }
    }else{
      const errorData = await res.json();
      console.error("Error:", errorData);
      alert("Error en la autenticación");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
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
    </div>
  );
}

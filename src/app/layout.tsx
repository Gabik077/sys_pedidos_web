"use client";
import "./globals.css";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Obtiene la ruta actual
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login"); // Redirige al login
  };

  // Si estamos en /login, solo mostramos el contenido sin el menú
  if (pathname === "/login") {
    return (
      <html lang="es">
          <body className="flex items-center justify-center min-h-screen bg-gray-200">{children}</body>
      </html>
    );
  }

  return (
    <html lang="es">
      <body className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`bg-gray-900 text-white p-4 transition-all duration-300 ${
            isOpen ? "w-64" : "w-16"
          }`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mb-4 text-gray-400 hover:text-white"
          >
            {isOpen ? "❌" : "☰"}
          </button>

          <nav className="space-y-2">
            <Link href="/" className="block p-2 hover:bg-gray-700 rounded">
              🏠 Home
            </Link>
            <Link href="/users" className="block p-2 hover:bg-gray-700 rounded">
              👥 Usuarios
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left p-2 hover:bg-red-700 rounded"
            >
              🚪 Cerrar sesión
            </button>
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6 bg-gray-100">{children}</div>
      </body>
    </html>
  );
}

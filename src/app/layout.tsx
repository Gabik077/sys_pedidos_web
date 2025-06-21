"use client";
import "./globals.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "./services/authService";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Obtiene la ruta actual
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null); // Guardar el rol del usuario



  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        if (data.status === "ok" && data.user) {
          setRole(data.user.role); // Guarda el rol del usuario
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    fetchUserRole();
  }, []);




  const handleLogout = async () => {
     const res = await logout();

     if (res.status === "ok") {
      router.push("/login"); // Redirige al login
     }
  };

  // Si estamos en /login, solo mostramos el contenido sin el menú
  if (pathname === "/login") {
    return (
      <html lang="es">
        <body className="flex items-center justify-center min-h-screen bg-white-200">{children}</body>
      </html>
    );
  }

  return (
    <html lang="es">
      <body className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`bg-gray-400 text-white p-4 transition-all duration-300 ${
            isOpen ? "w-64" : "w-16"
          }`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mb-4 text-gray-400 text-white"
          >
            {isOpen ? "❌" : "☰"}
          </button>

          <nav className="space-y-2">
            <Link href="/" className="flex items-center p-2 hover:bg-gray-700 rounded">
              🏠 {isOpen && <span className="ml-2">Home</span>}
            </Link>
            {role === "ADMINISTRADOR" && (
              <>
                <Link href="/users" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  👥 {isOpen && <span className="ml-2">Usuarios</span>}
                </Link>

              </>

            )}
              {(role === "ADMINISTRADOR" || role === "COMPRADOR" || role == "VENDEDOR") && (
                 <>
                <Link href="/products" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  🛒 {isOpen && <span className="ml-2">Productos</span>}
                </Link>
                </>
                )}

            {(role === "ADMINISTRADOR" || role === "COMPRADOR" ) && (
                 <>
                <Link href="/stock" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  🛒 {isOpen && <span className="ml-2">Gestión de Stock</span>}
                </Link>
                </>
                )}
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left p-2 hover:bg-red-700 rounded"
            >
              🚪 {isOpen && <span className="ml-2">Cerrar sesión</span>}
            </button>
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6 bg-gray-100">{children}</div>
      </body>
    </html>
  );
}

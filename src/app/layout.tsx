"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "./services/authService";
import { FaBoxOpen, FaShoppingCart, FaUser, FaHome, FaShoppingBasket, FaCalendar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { SlLogout } from "react-icons/sl";
import { FaFileInvoiceDollar } from "react-icons/fa6";

import { UserProvider, useUser } from "./context/UserContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const { role, loading } = useUser();

  const handleLogout = async () => {
    const res = await logout();
    if (res.status === "ok") {
      router.push("/login");
    }
  };

  if (pathname === "/login") {
    return (
      <html lang="es">
        <body className="flex items-center justify-center min-h-screen bg-white-200">
          {children}
        </body>
      </html>
    );
  }

  if (loading) {
    return (
      <html lang="es">
        <body className="flex items-center justify-center h-screen bg-white">
          <p>Cargando...</p>
        </body>
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
          <button onClick={() => setIsOpen(!isOpen)} className="mb-4 text-white">
            {isOpen ? <IoMdClose className="text-lg" /> : <RxHamburgerMenu className="text-lg" />}
          </button>

          <nav className="space-y-2">
            <Link href="/" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaHome className="text-lg" />
              {isOpen && <span className="ml-2">Home</span>}
            </Link>

            {role === "ADMINISTRADOR" && (
              <Link href="/users" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaUser className="text-lg" />
                {isOpen && <span className="ml-2">Usuarios</span>}
              </Link>
            )}

            {(role === "ADMINISTRADOR" || role === "VENDEDOR") && (
              <Link href="/facturacion" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaFileInvoiceDollar className="text-lg" />
                {isOpen && <span className="ml-2">Facturación</span>}
              </Link>
            )}

            {(role === "ADMINISTRADOR" || role === "VENDEDOR") && (
              <Link href="/pedidos" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaCalendar className="text-lg" />
                {isOpen && <span className="ml-2">Pedidos</span>}
              </Link>
            )}

            {(role === "ADMINISTRADOR" || role === "COMPRADOR" || role === "VENDEDOR") && (
              <Link href="/products" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaShoppingCart className="text-lg" />
                {isOpen && <span className="ml-2">Productos</span>}
              </Link>
            )}

            {(role === "ADMINISTRADOR" || role === "COMPRADOR") && (
              <>
                <Link href="/stock" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaBoxOpen className="text-lg" />
                  {isOpen && <span className="ml-2">Stock</span>}
                </Link>
                <Link href="/compras" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaShoppingBasket className="text-lg" />
                  {isOpen && <span className="ml-2">Compras</span>}
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left p-2 hover:bg-red-700 rounded"
            >
              <SlLogout className="text-lg" />
              {isOpen && <span className="ml-2">Cerrar sesión</span>}
            </button>
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6 bg-gray-100">{children}</div>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logout } from "@/app/services/authService";
import { useUser } from "@/app/context/UserContext";
import {
  FaBoxOpen, FaShoppingCart, FaUser, FaHome, FaShoppingBasket,
  FaCalendar, FaTruckMoving, FaUserFriends, FaFileInvoiceDollar
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { SlLogout } from "react-icons/sl";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, loading } = useUser();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
    const res = await logout();
    if (res.status === "ok") router.push("/login");
  };

  if (pathname === "/login") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        {children}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-400 text-white p-4 transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <button onClick={() => setIsOpen(!isOpen)} className="mb-4 text-white">
          {isOpen ? <IoMdClose /> : <RxHamburgerMenu />}
        </button>

        <nav className="space-y-2">
          <Link href="/" className="flex items-center p-2 hover:bg-gray-700 rounded" title={!isOpen ? "Home" : ""}>
            <FaHome />
            {isOpen && <span className="ml-2">Home</span>}
          </Link>

          {(role === "ADMINISTRADOR" || role === "SYSADMIN") && (
            <Link href="/users" className="flex items-center p-2 hover:bg-gray-700 rounded" title={!isOpen ? "Usuarios" : ""}>
              <FaUser />
              {isOpen && <span className="ml-2">Usuarios</span>}
            </Link>
          )}

          {(role === "ADMINISTRADOR" || role === "SYSADMIN" || role === "VENDEDOR") && (
            <>
              <Link href="/facturacion" className="flex items-center p-2 hover:bg-gray-700 rounded" title={!isOpen ? "Facturación" : ""}>
                <FaFileInvoiceDollar />
                {isOpen && <span className="ml-2">Facturación</span>}
              </Link>
              <Link href="/clients" className="flex items-center p-2 hover:bg-gray-700 rounded" title={!isOpen ? "Clientes" : ""}>
                <FaUserFriends />
                {isOpen && <span className="ml-2">Clientes</span>}
              </Link>
              <Link href="/pedidos" className="flex items-center p-2 hover:bg-gray-700 rounded" title={!isOpen ? "Pedidos" : ""}>
                <FaCalendar />
                {isOpen && <span className="ml-2">Pedidos</span>}
              </Link>
            </>
          )}

          {(role === "ADMINISTRADOR" || role === "SYSADMIN") && (
            <Link href="/moviles" className="flex items-center p-2 hover:bg-gray-700 rounded" title={!isOpen ? "Moviles" : ""}>
              <FaTruckMoving />
              {isOpen && <span className="ml-2">Moviles</span>}
            </Link>
          )}

          {(role === "ADMINISTRADOR" || role === "SYSADMIN" || role === "COMPRADOR" || role === "VENDEDOR") && (
            <Link href="/products" className="flex items-center p-2 hover:bg-gray-700 rounded" title={!isOpen ? "Productos" : ""}>
              <FaShoppingCart />
              {isOpen && <span className="ml-2">Productos</span>}
            </Link>
          )}

          {(role === "ADMINISTRADOR" || role === "SYSADMIN" || role === "COMPRADOR") && (
            <>
              <Link href="/stock" className="flex items-center p-2 hover:bg-gray-700 rounded" title={!isOpen ? "Stock" : ""}>
                <FaBoxOpen />
                {isOpen && <span className="ml-2">Stock</span>}
              </Link>
              <Link href="/compras" className="flex items-center p-2 hover:bg-gray-700 rounded" title={!isOpen ? "Compras" : ""}>
                <FaShoppingBasket />
                {isOpen && <span className="ml-2">Compras</span>}
              </Link>
            </>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left p-2 hover:bg-red-700 rounded"
            title={!isOpen ? "Cerrar sesión" : ""}
          >
            <SlLogout />
            {isOpen && <span className="ml-2">Cerrar sesión</span>}
          </button>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">{children}</div>
    </div>
  );
}

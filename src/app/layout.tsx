"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "./services/authService";
import { FaBoxOpen, FaShoppingCart, FaUser, FaHome, FaShoppingBasket, FaCalendar, FaHouseUser, FaUserFriends, FaTruckMoving, FaUserTie } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { SlLogout } from "react-icons/sl";
import { FaFileInvoiceDollar } from "react-icons/fa6";

import { UserProvider, useUser } from "./context/UserContext";
import { NavItem } from "./navItemLayout";
import Header from "./header";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const { role, loading } = useUser();

  const logoutNext = async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    return await res.json();
  };

  const handleLogout = async () => {
    const resLogout = await logoutNext();
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
     <body className="flex min-h-screen">
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
            <NavItem href="/" label="Home" Icon={FaHome} isOpen={isOpen} pathname={pathname} />

            {role === "ADMINISTRADOR" || role === "SYSADMIN" && (
              <NavItem href="/users" label="Usuarios" Icon={FaUser} isOpen={isOpen} pathname={pathname} />
            )}

            {(role === "ADMINISTRADOR" || role === "SYSADMIN" || role === "VENDEDOR") && (
               <NavItem href="/facturacion" label="Facturación" Icon={FaFileInvoiceDollar} isOpen={isOpen} pathname={pathname} />
            )}

          {(role === "ADMINISTRADOR" || role === "SYSADMIN" || role === "VENDEDOR") && (
              <NavItem href="/clients" label="Clientes" Icon={FaUserFriends} isOpen={isOpen} pathname={pathname} />
            )}

           {(role === "ADMINISTRADOR" || role === "SYSADMIN") && (
              <NavItem href="/vendedores" label="Vendedores" Icon={FaUserTie} isOpen={isOpen} pathname={pathname} />
            )}

            {(role === "ADMINISTRADOR" || role === "SYSADMIN" || role === "VENDEDOR") && (
              <NavItem href="/pedidos" label="Pedidos" Icon={FaCalendar} isOpen={isOpen} pathname={pathname} />
            )}

            {(role === "ADMINISTRADOR" || role === "SYSADMIN" || role === "COMPRADOR" || role === "VENDEDOR") && (
              <NavItem href="/products" label="Productos" Icon={FaShoppingCart} isOpen={isOpen} pathname={pathname} />
            )}

            {(role === "ADMINISTRADOR" || role === "SYSADMIN" || role === "COMPRADOR") && (

                <NavItem href="/stock" label="Stock" Icon={FaBoxOpen} isOpen={isOpen} pathname={pathname} />

            )}

           {(role === "ADMINISTRADOR" || role === "SYSADMIN") && (
            <NavItem href="/moviles" label="Moviles" Icon={FaTruckMoving} isOpen={isOpen} pathname={pathname} />
            )}

            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left p-2 hover:bg-red-700 rounded"
              title={!isOpen ? "Cerrar sesión" : ""}
            >
              <SlLogout className="text-lg" />
              {isOpen && <span className="ml-2">Cerrar sesión</span>}
            </button>
          </nav>
        </div>

        {/* Contenido principal */}

          <div className="flex-1 bg-gray-100 overflow-auto">
          <Header />
          <main >{children}</main>
        </div>
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

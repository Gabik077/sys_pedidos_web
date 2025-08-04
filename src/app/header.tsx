// components/Header.tsx
'use client';

import { useUser } from "@/app/context/UserContext";
import { useState } from "react";
import { FaAngleDown, FaArrowAltCircleDown } from "react-icons/fa";

export default function Header() {
  const {  user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(prev => !prev);

  return (
    <header className="w-full bg-gray-000  p-0 flex justify-between items-center">
      <h1 className="text-lg font-semibold"></h1>
      <div className="relative">
        <button
          onClick={toggleMenu}
          className="flex items-center gap-2 bg-gray-100 px-2 py-2 rounded hover:bg-gray-50"
        >
         Bienvenido {user?.username ?? "Usuario"}
          <span><FaAngleDown /></span>
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">Perfil</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">Configuración</a>
          </div>
        )}
      </div>
    </header>
  );
}

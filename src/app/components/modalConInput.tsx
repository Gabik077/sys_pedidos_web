'use client';

import { useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  message: string;
}

export default function InputModal({ isOpen, onClose, onConfirm, message }: ConfirmModalProps) {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(password);
    setPassword(""); // limpiar campo al confirmar
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      onClick={onClose} // cerrar al tocar fondo
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-80 z-50"
        onClick={(e) => e.stopPropagation()} // evitar cierre si clic es dentro
      >
        <h2 className="text-lg text-gray-700 font-bold mb-4">Confirmación</h2>
        <p className="mb-4 text-gray-600">{message}</p>

        {/* 🔹 Campo de contraseña */}
        <input
          type="password"
          placeholder="Ingrese contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!password.trim()} // desactivar si está vacío
            className={`px-4 py-2 rounded-md transition ${
              password.trim()
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

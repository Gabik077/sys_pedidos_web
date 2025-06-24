'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      onClick={onClose} // 👈 cerrar al tocar fondo
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-80 z-50"
        onClick={(e) => e.stopPropagation()} // 👈 evitar que cierre si clic es dentro
      >
        <h2 className="text-lg text-gray-700 font-bold mb-4">Confirmación</h2>
        <p className="mb-4 text-gray-600">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

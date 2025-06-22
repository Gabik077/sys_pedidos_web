"use client";

import { useState } from "react";
import Link from "next/link";
import PedidosMap from "./components/pedidoMapaView";



const tabs = ["Crear Pedido", "Lista de Pedidos", "Pedidos Pendientes", "Pedidos Entregados","Pedidos en Mapa"];

export default function ComprasTabsPage() {
  const [activeTab, setActiveTab] = useState("Crear Pedido");

  return (
    <div className="p-6">
      <h1 className="text-2xl text-gray-500 font-bold mb-4">Gestión de Pedidos</h1>
      <div className="flex space-x-4 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 border-b-2 transition-all duration-300 ${
              activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
      <div>
        {activeTab === "Crear Pedido" && <h1 className="text-2xl font-bold mb-4">Crear Pedido</h1>}
        {activeTab === "Lista de Pedidos" && <h1 className="text-2xl font-bold mb-4">Lista de Pedidos</h1>}
        {activeTab === "Pedidos Pendientes" && <h1 className="text-2xl font-bold mb-4">Pedidos Pendientes</h1>}
        {activeTab === "Pedidos Entregados" && <h1 className="text-2xl font-bold mb-4">Pedidos Entregados</h1>}
        {activeTab === "Pedidos en Mapa" && <PedidosMap />}


      </div>
      </div>
    </div>
  );
}

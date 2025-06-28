"use client";

import { useState } from "react";
import Link from "next/link";
import PedidosMap from "./components/pedidoMapaView";
import CrearPedidoView from "./components/crearPedidoView";



const tabs = ["Crear Pedido", "Pedidos Pendientes", "Pedidos Entregados","Pedidos en Mapa", "Envios de Pedidos"];

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
        {activeTab === "Crear Pedido" && <CrearPedidoView />}
        {activeTab === "Pedidos Pendientes" && <h1 className="text-2xl font-bold mb-4">Pedidos Pendientes</h1>}
        {activeTab === "Pedidos Entregados" && <h1 className="text-2xl font-bold mb-4">Pedidos Entregados</h1>}
        {activeTab === "Pedidos en Mapa" && <PedidosMap />}
        {activeTab === "Envios de Pedidos" && <h1 className="text-2xl font-bold mb-4">Administrar Envios</h1>}

      </div>
      </div>
    </div>
  );
}

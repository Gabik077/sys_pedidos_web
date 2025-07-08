"use client";

import { useState } from "react";
import CrearPedidoView from "./components/crearPedidoView";
import EnvioPedidosView from "./components/envioPedidosView";
import PedidosPendientesView from "./components/pedidosPendientesView";
import PedidosEnviadosView from "./components/pedidosEnviadosView";
import PedidosEntregadosView from "./components/pedidosEntregados";

const tabs = ["Crear Pedido", "Pedidos Pendientes", "Reparto", "Pedidos Enviados","Pedidos Entregados"];

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
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        <div className={activeTab === "Crear Pedido" ? "" : "hidden"}>
          <CrearPedidoView />
        </div>
        <div className={activeTab === "Pedidos Pendientes" ? "" : "hidden"}>
          <PedidosPendientesView />
        </div>

        <div className={activeTab === "Reparto" ? "" : "hidden"}>
          <EnvioPedidosView />
        </div>

        <div className={activeTab === "Pedidos Enviados" ? "" : "hidden"}>
          <PedidosEnviadosView />
        </div>
        <div className={activeTab === "Pedidos Entregados" ? "" : "hidden"}>
         <PedidosEntregadosView />
        </div>
      </div>
    </div>
  );
}

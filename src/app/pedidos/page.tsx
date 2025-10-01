"use client";

import { useEffect, useState } from "react";
import CrearPedidoView from "./components/pedidos/crearPedidoView";
import EnvioPedidosView from "./components/envios/envioPedidosView";
import PedidosPendientesView from "./components/pedidos/pedidosPendientesView";
import PedidosEnviadosView from "./components/pedidos/pedidosEnviadosView";
import PedidosEntregadosView from "./components/pedidos/pedidosEntregados";
import { useUser } from "../context/UserContext";


let tabs = ["Crear Pedido", "Pedidos Pendientes", "Reparto", "Pedidos Enviados", "Pedidos Entregados"];


export default function PedidosTabsPage() {
  const [activeTab, setActiveTab] = useState("Crear Pedido");
  const [pedidoEnProgreso, setPedidoEnProgreso] = useState(false);
  const { role, loading } = useUser();

  useEffect(() => {
    const draft = localStorage.getItem("pedidoEnProgreso");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.productos?.length > 0 || parsed.cliente_nombre.length > 0) {
          setPedidoEnProgreso(true);
        }else{
          setPedidoEnProgreso(false);
        }
      } catch {}
    }
  }, [activeTab]);

  if(role !== "ADMINISTRADOR" && role !== "SYSADMIN") {
    tabs = ["Crear Pedido", "Pedidos Pendientes"];
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl text-gray-500 font-bold mb-4">Gestión de Pedidos</h1>

      <div className="flex space-x-4 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-2 border-b-2 transition-all duration-300 ${
              activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab}
            {tab === "Crear Pedido" && pedidoEnProgreso && (
              <span className="absolute -top-1 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                !
              </span>
            )}
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
          {(role === "ADMINISTRADOR" || role === "SYSADMIN") && (
          <EnvioPedidosView />
          )}
        </div>
        <div className={activeTab === "Pedidos Enviados" ? "" : "hidden"}>
            {(role === "ADMINISTRADOR" || role === "SYSADMIN") && (
          <PedidosEnviadosView />
            )}
        </div>
        <div className={activeTab === "Pedidos Entregados" ? "" : "hidden"}>
            {(role === "ADMINISTRADOR" || role === "SYSADMIN") && (
          <PedidosEntregadosView />
            )}
        </div>
      </div>
    </div>
  );
}

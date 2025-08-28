"use client";

import { useEffect, useState } from "react";
import InformeVentasView from "./componentes/informeVentasView";
import InformePedidosPorVendedor from "./componentes/informePedidosPorVendedor";
import InformeVentasDeliveryView from "./componentes/informeVentasDeliveryView";

const tabs = ["Ventas Salón", "Ventas con Delivery", "Pedidos por Vendedor"];

export default function InformesTabsPage() {
  const [activeTab, setActiveTab] = useState("Ventas Salón");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-500 mb-4">Informes</h1>
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

      {/* Montamos todos los componentes UNA sola vez */}
      <div>
        <div className={activeTab === "Ventas Salón" ? "" : "hidden"}>
          <InformeVentasView />
        </div>

        <div className={activeTab === "Ventas con Delivery" ? "" : "hidden"}>
          <InformeVentasDeliveryView />
        </div>

        <div className={activeTab === "Pedidos por Vendedor" ? "" : "hidden"}>
          <InformePedidosPorVendedor />
        </div>
      </div>
    </div>
  );
}

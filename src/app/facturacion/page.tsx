"use client";

import { useState } from "react";
import Link from "next/link";
import FacturacionView from "./components/facturacionView";
import VentasView from "./components/ventasView";



const tabs = ["Facturación", "Ventas"];

export default function StockTabsPage() {
  const [activeTab, setActiveTab] = useState("Facturación");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-500 mb-4">Facturación</h1>
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
        {activeTab === "Facturación" && <FacturacionView />}
        {activeTab === "Ventas" && <VentasView />}

      </div>
      </div>
    </div>
  );
}

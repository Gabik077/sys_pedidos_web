"use client";

import { useState } from "react";
import Link from "next/link";
import ProductosView from "./components/ProductosView";
import EntradasView from "./components/EntradasView";
import SalidasView from "./components/SalidasView";
import StockView from "./components/StockView";


const tabs = ["Stock", "Productos", "Entradas", "Salidas"];

export default function StockTabsPage() {
  const [activeTab, setActiveTab] = useState("Stock");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Stock</h1>
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
        {activeTab === "Stock" && <StockView />}
        {activeTab === "Productos" && <ProductosView />}
        {activeTab === "Entradas" && <EntradasView />}
        {activeTab === "Salidas" && <SalidasView />}
      </div>
      </div>
    </div>
  );
}

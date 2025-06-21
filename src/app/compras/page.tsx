"use client";

import { useState } from "react";
import Link from "next/link";



const tabs = ["Compras", "Proveedores"];

export default function ComprasTabsPage() {
  const [activeTab, setActiveTab] = useState("Compras");

  return (
    <div className="p-6">
      <h1 className="text-2xl text-gray-500 font-bold mb-4">Gestión de Compras</h1>
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
        {activeTab === "Compras" && <h1 className="text-2xl font-bold mb-4">Compras</h1>}
        {activeTab === "Proveedores" && <h1 className="text-2xl font-bold mb-4">Proveedores</h1>}
      </div>
      </div>
    </div>
  );
}

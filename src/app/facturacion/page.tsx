"use client";

import { useState } from "react";
import Link from "next/link";
import FacturacionView from "./components/facturacionView";
import VentasView from "./components/ventasView";
import InputModal from "../components/modalConInput";
import VentasDeliveryView from "./components/ventasDeliveryView";


const tabs = ["Facturación", "Ventas", "Ventas con Delivery"];

export default function StockTabsPage() {
  const [activeTab, setActiveTab] = useState("Facturación");
  const [selectedTab, setSelectedTab] = useState("Facturación");
  const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirm = (password: string) => {
      console.log("Contraseña ingresada:", password);

      if (password === "1234.") {
      if(selectedTab==="Ventas"){
       setActiveTab("Ventas");

      } else if (selectedTab === "Ventas con Delivery") {
        setActiveTab("Ventas con Delivery");
      }
      } else {
        alert("Contraseña incorrecta ❌");
      }
      setIsModalOpen(false);
    };

  const openModal = (tab: string) => {
      setSelectedTab(tab);
    if (tab === "Facturación") {
       setActiveTab(tab);
    }
      else if (tab === "Ventas con Delivery" || tab === "Ventas") {
       setIsModalOpen(true);
    }

  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-500 mb-4">Facturación</h1>
      <div className="flex space-x-4 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => openModal(tab)}
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
        {activeTab === "Ventas con Delivery" && <VentasDeliveryView />}

      </div>
      </div>
       <InputModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
          message="Ingrese su contraseña para continuar"
        />
    </div>
  );
}

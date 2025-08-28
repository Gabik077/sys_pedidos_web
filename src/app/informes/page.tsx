"use client";

import { useState } from "react";
import Link from "next/link";
import InformeVentasView from "./componentes/informeVentasView";
import InputModal from "../components/modalConInput";
import InformePedidosPorVendedor from "./componentes/informePedidosPorVendedor";
import InformeVentasDeliveryView from "./componentes/informeVentasDeliveryView";

const tabs = [ "Ventas Salón", "Ventas con Delivery","Pedidos por Vendedor"];

export default function InformesTabsPage() {
  const [activeTab, setActiveTab] = useState("Ventas Salón");
  const [selectedTab, setSelectedTab] = useState("Ventas Salón");
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
      <h1 className="text-2xl font-bold text-gray-500 mb-4">Informes</h1>
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

        {activeTab === "Ventas Salón" && <InformeVentasView />}
        {activeTab === "Ventas con Delivery" && <InformeVentasDeliveryView />}
        {activeTab === "Pedidos por Vendedor" && <InformePedidosPorVendedor />}

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

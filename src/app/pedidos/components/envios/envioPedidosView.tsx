"use client";

import { useEffect, useState } from "react";
import { getPedidos, insertEnvioPedidos } from "@/app/services/stockService";
import dynamic from "next/dynamic";
import DropdownMovil from "./DropdownMovil";
import PedidoItem from "../pedidos/PedidoItem";
import ListaRutaOrdenada from "./ListaRutaOrdenada";
import type { Pedido } from "../../../types";
import { FaSyncAlt } from "react-icons/fa";

const MapaConPedidos = dynamic(() => import("./MapaConPedidos"), {
  ssr: false,
});


export default function EnvioPedidosView() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosSeleccionados, setPedidosSeleccionados] = useState<Pedido[]>([]);//para mostrar en el mapa
  const [movilSeleccionado, setMovilSeleccionado] = useState<number | null>(null);
  const [origenLat, setOrigenLat] = useState<string>("-25.377676990645696");// Valor por defecto para pruebas
  const [origenLon, setOrigenLon] = useState<string>("-57.570087369311956"); // Valor por defecto para pruebas
  const [calcularRuta, setCalcularRuta] = useState<boolean>(false);
  const [filtroFecha, setFiltroFecha] = useState<string>("");
  const [pedidosOrdenados, setPedidosOrdenados] = useState<Pedido[]>([]);//para listar ruta ordenada
  const [loading, setLoading] = useState(false);
  const [totalesCalculados, setTotalesCalculados] = useState<{ distancia: string; duracion: string }>({ distancia: "", duracion: "" });

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const pedidos = await getPedidos("pendiente");
      setPedidos(pedidos);
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const pedidos = await getPedidos("pendiente");
        setPedidos(pedidos);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
      }
    };

    fetchPedidos();
  }, []);

  const togglePedido = (pedido: Pedido) => {
    setPedidosSeleccionados((prev) => {
      if (prev.find((p) => p.id === pedido.id)) {
        return prev.filter((p) => p.id !== pedido.id);
      }
      return [...prev, pedido];
    });
  };


  const handleGuardarEnvio = async () => {
    if (!pedidosOrdenados || !origenLat || !origenLon || pedidosSeleccionados.length === 0) {
      alert("Completa todos los campos y selecciona al menos un pedido.");
      return;
    }
    if(movilSeleccionado === 0 ){
      alert("Selecciona un móvil válido.");
      return;
    }
    if(pedidosOrdenados.length === 0) {
      alert("No hay pedidos ordenados para guardar.");
      return;
    }

    const data = {
      idMovil: movilSeleccionado,
      pedidos: pedidosOrdenados.map((p) => p.id),
      kmCalculado: totalesCalculados.distancia,
      tiempoCalculado: totalesCalculados.duracion,
    };

    const envio = await insertEnvioPedidos(data);

    if (envio.status === "ok") {
      alert("Envío guardado exitosamente.");
      setPedidosSeleccionados([]);
      setPedidosOrdenados([]);
      setMovilSeleccionado(null); // Reiniciar móvil seleccionado
      setCalcularRuta(false); // Reiniciar cálculo de ruta
      fetchPedidos(); // Refrescar lista de pedidos
    } else {
      alert("Error al guardar el envío: " + envio.message);
    }

    console.log("Guardando envío:", data);
    // Aquí deberías hacer la llamada a la API para guardar el envío
  };

  const handleCalcularRuta = () => {
    setCalcularRuta(false); // reiniciar para forzar render
    setTimeout(() => setCalcularRuta(true), 0);
  };

  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-bold mb-1 text-gray-500">Crear Reparto</h2>
      <h3 className="text-gray-500"> Distancia : {totalesCalculados.distancia === "" ? "0" : totalesCalculados.distancia }   -  Tiempo: {totalesCalculados.duracion === "" ? "0" : totalesCalculados.duracion}</h3>
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-center">
        <button
          title="Actualizar Pedidos"
          onClick={fetchPedidos}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >

          {loading ? "cargando..." : <FaSyncAlt className="text-lg" />}
        </button>


  <input
    type="date"
    value={filtroFecha}
    onChange={(e) => setFiltroFecha(e.target.value)}
    className="border rounded px-3 py-2"
  />

        <DropdownMovil onSelect={(id) => setMovilSeleccionado(id)} />
        <input
          type="text"
          placeholder="Latitud de origen"
          value={origenLat}
          onChange={(e) => setOrigenLat(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-64"
        />
        <input
          type="text"
          placeholder="Longitud de origen"
          value={origenLon}
          onChange={(e) => setOrigenLon(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-64"
        />
        <button
          onClick={handleGuardarEnvio}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar Envío
        </button>
        <button
          onClick={handleCalcularRuta}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Calcular Ruta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="max-h-[75vh] overflow-y-auto space-y-4 text-gray-500">
        {pedidos
            .filter((pedido) => {


                // Filtro por fecha (asumiendo pedido.fecha es tipo ISO o similar)
                if (filtroFecha && !pedido.fechaPedido.startsWith(filtroFecha)) {
                return false;
                }

                return true;
            })
            .map((pedido) => (
                <PedidoItem
                key={pedido.id}
                pedido={pedido}
                seleccionado={pedidosSeleccionados.some((p) => p.id === pedido.id)}
                onToggle={() => togglePedido(pedido)}
                />
            ))}
        </div>

        <div className="h-[75vh]">
          <MapaConPedidos
            pedidos={pedidosSeleccionados}
            origen={{ lat: parseFloat(origenLat), lng: parseFloat(origenLon) }}
            calcularRuta={calcularRuta}
            onOrdenOptimizado={(ordenados) => setPedidosOrdenados(ordenados)}
          />
        </div>
      </div>

      <div className="mt-6">
        <ListaRutaOrdenada
          pedidos={pedidosOrdenados.length > 0 ? pedidosOrdenados : []}
//          pedidos={pedidosSeleccionados}
          origen={{ lat: parseFloat(origenLat), lng: parseFloat(origenLon) }}
          calcularRuta={calcularRuta}
          onTotalesCalculados={(totales) => setTotalesCalculados(totales)}
          />
        </div>
    </div>
  );
}

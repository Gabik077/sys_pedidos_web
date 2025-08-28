"use client";

import { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { useUser } from "@/app/context/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchVentas } from "@/app/services/stockService";
import { Venta } from "@/app/types";
import { handleImprimirProductosVendidos } from "@/app/facturacion/components/impresion/handleImprimirProductosVendidos";


export default function InformeVentasView() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);
const [filtroFecha, setFiltroFecha] = useState(() => {

  const today = new Date();

  return today;
});

const [filtroFechaFin, setFiltroFechaFin] = useState(() => {

  const today = new Date();

  return today;
});


  const [filtroEstado, setFiltroEstado] = useState<string>("TODAS");
  const { token } = useUser();

  if (!token) {
    window.location.href = "/login";
    return null;
  }


  const getVentas = async () => {
    setLoading(true);
    try {
      if (!filtroFecha || !filtroFechaFin) {
        alert("Por favor, selecciona una fecha válida.");
        return;
      }
      //fecha Inicio
     const dateObj = new Date(filtroFecha);
     const dia = dateObj.getDate();
     const mes = dateObj.getMonth() + 1; // Los meses en JS van de 0 a 11
     const anio = dateObj.getFullYear();
     const diaStr = dia < 10 ? `0${dia}` : `${dia}`;
     const mesStr = mes < 10 ? `0${mes}` : `${mes}`;
     const fecha = `${mesStr}-${diaStr}-${anio}`;

         //fecha Fin
     const dateObjFin = new Date(filtroFechaFin);
     const diaFin = dateObjFin.getDate();
     const mesFin = dateObjFin.getMonth() + 1; // Los meses en JS van de 0 a 11
     const anioFin = dateObjFin.getFullYear();
     const diaStrFin = diaFin < 10 ? `0${diaFin}` : `${diaFin}`;
     const mesStrFin = mesFin < 10 ? `0${mesFin}` : `${mesFin}`;
     const fechaFin = `${mesStrFin}-${diaStrFin}-${anioFin}`;


     const data = await fetchVentas(token, fecha,fechaFin);

      if (!Array.isArray(data)) {
        alert("Error: "+data.message );
        setVentas([]);
        setLoading(false);
        return;
      }
      setVentas(data);
    } catch (err) {
      console.error("Error al obtener ventas:", err);
    } finally {
      setLoading(false);
    }
  };

  const ventasFiltradas =
    filtroEstado === "TODAS"
      ? ventas
      : ventas
      .filter((v) => v.estado === filtroEstado );


  useEffect(() => {
    getVentas();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-500">Ventas</h2>
Desde:
<DatePicker
  selected={
    filtroFecha
      ? new Date(filtroFecha)
      : new Date(new Date().setHours(12, 0, 0, 0)) // Forzar mediodía para evitar desfase
  }
  onChange={(date) => {
    if (date) {

  const today = new Date(date);

      const fecha = today.toISOString().split("T")[0];

      setFiltroFecha(today);

    }
  }}
  dateFormat="dd/MM/yyyy"
/>
Hasta:
<DatePicker
  selected={
    filtroFechaFin
      ? new Date(filtroFechaFin)
      : new Date(new Date().setHours(12, 0, 0, 0)) // Forzar mediodía para evitar desfase
  }
  onChange={(date) => {
    if (date) {

  const today = new Date(date);

      const fecha = today.toISOString().split("T")[0];

      setFiltroFechaFin(today);


    }
  }}
  dateFormat="dd/MM/yyyy"
/>
        <button
          title="Actualizar Ventas"
          onClick={getVentas}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Cargando..." : <FaSyncAlt className="text-lg" />}
        </button>


        <button
          onClick={() => handleImprimirProductosVendidos(ventasFiltradas)}
          className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Imprimir
        </button>

        <h1 className="text-lg font-semibold text-gray-600">
          <strong>Cantidad: {ventasFiltradas.length}</strong>
        </h1>

        <h1 className="text-lg font-semibold text-gray-600">
          <strong>Monto: {ventasFiltradas.reduce((acc, venta) => {
            return acc + Number(venta.total_venta || 0);
          }, 0).toLocaleString("es-PY", { style: "currency", currency: "PYG" })}</strong>
        </h1>

      </div>

      <div className="space-y-4 text-gray-700">
        {ventasFiltradas.map((venta) => (
          <div
            key={venta.id}
            className="border p-4 mb-6 rounded shadow bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-600">
                Venta #{venta.id} -{" "}
                {new Date(venta.fecha_venta).toLocaleString("es-PY")}
              </h3>

              <span
                className={`px-2 py-1 rounded font-semibold text-white ${
                  venta.estado === "completada"
                    ? "bg-green-600"
                    : venta.estado === "pendiente"
                    ? "bg-orange-500"
                    : venta.estado === "cancelada"
                    ? "bg-red-500"
                    : "bg-gray-400"
                }`}
              >
                {venta.estado}
              </span>
            </div>
               <p>
               <strong>Cliente:</strong> {venta.cliente?.nombre || venta.cliente_nombre || "No asignado"} {venta.cliente?.apellido || ""}
              </p>
              <p>
              <strong>Tipo Venta:</strong> {venta.tipo_venta || "No asignado"}
              </p>
            <p>
              <strong>Método de pago:</strong> {venta.metodo_pago}
            </p>
              <strong>Total:</strong>{" "}
            {Number(venta.total_venta).toLocaleString("es-PY", { style: "currency", currency: "PYG" })}
            <p>Productos:</p>
            <ul className="list-disc pl-6">
              {venta.salida_stock_general?.salidas.map((detalle) => (
                <li key={detalle.id}>
                  {detalle.producto.nombre} - Cantidad: {detalle.cantidad} - Precio:{" "}
                  {Number(detalle.producto.precio_venta).toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                  })}
                </li>
              ))}
            </ul>
          </div>

        ))}
      </div>
    </div>
  );
}

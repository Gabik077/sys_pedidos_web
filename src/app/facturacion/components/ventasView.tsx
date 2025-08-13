"use client";

import { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { useUser } from "@/app/context/UserContext";
import { formatFechaSinHora } from "@/app/utils/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { on } from "events";
import { fetchVentas } from "@/app/services/stockService";

export default function VentasView() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
const [filtroFecha, setFiltroFecha] = useState(() => {

  const today = new Date();

  return today;
});


  const [filtroEstado, setFiltroEstado] = useState<string>("TODAS");
  const [totalVentas, setTotalVentas] = useState<number>(0);
  const { token } = useUser();

  if (!token) {
    window.location.href = "/login";
    return null;
  }

  const onSelectFecha = (fecha: string) => {

    console.log(fecha);

  };



  const getVentas = async () => {
    setLoading(true);
    try {
      if (!filtroFecha) {
        alert("Por favor, selecciona una fecha válida.");
        return;
      }
     const dateObj = new Date(filtroFecha);
     const dia = dateObj.getDate();
     const mes = dateObj.getMonth() + 1; // Los meses en JS van de 0 a 11
     const anio = dateObj.getFullYear();
     const diaStr = dia < 10 ? `0${dia}` : `${dia}`;
     const mesStr = mes < 10 ? `0${mes}` : `${mes}`;
     const fecha = `${mesStr}-${diaStr}-${anio}`;
     const data = await fetchVentas(token, fecha);


      if (!Array.isArray(data)) {
        console.error("Respuesta inesperada de /ventas", data);
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
      : ventas.filter((v) => v.estado === filtroEstado);

  useEffect(() => {
    getVentas();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-500">Lista de Ventas</h2>

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
      onSelectFecha(new Date(fecha).getDate() + "/" + (new Date(fecha).getMonth() + 1) + "/" + new Date(fecha).getFullYear());

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

        <h1 className="text-lg font-semibold text-gray-600">
          <strong>Cantidad Total: {ventasFiltradas.length}</strong>
        </h1>

        <h1 className="text-lg font-semibold text-gray-600">
          <strong>Monto Total: {ventasFiltradas.reduce((acc, venta) => {
            const total = venta.salida_stock_general?.salidas?.reduce((sum: number, salida: any) => {
              return sum + (salida.producto?.precio_venta * salida.cantidad || 0);
            }, 0) || 0;
            return acc + total;
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
              <strong>Método de pago:</strong> {venta.metodo_pago}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              {venta.salida_stock_general?.salidas?.reduce((acc: number, salida: any) => {
               // setTotalVentas(totalVentas + (acc + (salida.producto?.precio_venta * salida.cantidad || 0)));
                return acc + (salida.producto?.precio_venta * salida.cantidad || 0);
              }, 0).toLocaleString("es-PY", {
                style: "currency",
                currency: "PYG",
              })}
            </p>


            <h4 className="mt-4 font-semibold">Productos</h4>
            <ul className="pl-4 list-disc">
              {venta.salida_stock_general?.salidas?.map((salida: any) => (
                <li key={salida.id}>
                  {salida.producto?.nombre} - Cant: {salida.cantidad} - Precio:{" "}
                  {Number(salida.producto?.precio_venta).toLocaleString(
                    "es-PY",
                    { style: "currency", currency: "PYG" }
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

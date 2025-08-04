// app/components/enviosPendientesView.tsx
"use client";

import { useEffect, useState } from "react";
import { guardaEstadoPedido, getEnvios, guardarEstadoPedido } from "@/app/services/stockService"; // Asegúrate de que estos endpoints existan
import { ComboDetalle, Detalle, EnvioHeader } from "../../../types";
import { FaSyncAlt } from "react-icons/fa";
import { useUser } from "@/app/context/UserContext";
import { formatearFecha } from "@/app/utils/utils";
import { handleImprimirPlanilla } from "../empresion/handleImprimirPlanilla";
import { handleImprimirEnvio } from "../empresion/handleImprimirEnvio";
import { handleImprimirProductos } from "../empresion/handleImprimirProductos";


export default function PedidosEntregadosView() {
  const [envios, setEnvios] = useState<EnvioHeader[]>([]);
  const [enviosExpandido, setEnviosExpandido] = useState<Set<number>>(new Set());
  const [productosExpandidoPorPedido, setProductosExpandidoPorPedido] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const { token } = useUser();

  if (!token) {
    window.location.href = "/login";
    return null; // Evitar renderizado adicional si no hay token
  }

    const fetchEnvios = async () => {
      setLoading(true);
      try {
        const data = await getEnvios(token, "entregado");
        setEnvios(data);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEnvios(token,"entregado"); // Asegúrate de que este endpoint exista y retorne envíos pendientes
      setEnvios(data);
    };
    fetchData();
  }, []);


  const toggleProductosPedido = (pedidoId: number) => {
    setProductosExpandidoPorPedido(prev => ({
      ...prev,
      [pedidoId]: !prev[pedidoId],
    }));
  };

  const toggleEnvioExpandido = (id: number) => {
    setEnviosExpandido(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) {
        nuevo.delete(id);
      } else {
        nuevo.add(id);
      }
      return nuevo;
    });
  };


  const handleVerEnGoogleMaps = (envio: EnvioHeader) => {
    if (!envio.envioPedido || envio.envioPedido.length === 0 || envio.envioPedido.length == 0) {
      alert("No hay pedidos asociados a este envío.");
      return;
    }
    const pedidoslimitados = envio.envioPedido.slice(0, 23); // Limitar a 23 pedidos para evitar problemas con Google Maps

    // Usamos la ubicación del primer cliente como origen y destino
    const pedidosOrdenados = pedidoslimitados
      .map(ep => ep.pedido)
      .filter(p => p.cliente?.lat !== undefined && p.cliente?.lon !== undefined)
      .sort((a, b) => {
        const epA = pedidoslimitados.find(e => e.pedido.id === a.id);
        const epB = pedidoslimitados.find(e => e.pedido.id === b.id);
        return (epA?.ordenEnvio ?? 0) - (epB?.ordenEnvio ?? 0);
      });

    if (pedidosOrdenados.length === 0) {
      alert("No hay ubicaciones válidas de clientes para este envío.");
      return;
    }

    const origen = envio.inicioRutaLat && envio.inicioRutaLon
    ? `${envio.inicioRutaLat},${envio.inicioRutaLon}`
    : null;

  // Separar pedidos intermedios y destino
  const pedidosIntermedios = pedidosOrdenados.slice(0, -1);
  const ultimoPedido = pedidosOrdenados[pedidosOrdenados.length - 1];

  // Si no se definió un destino manualmente, tomar el último cliente como destino
  const destino = `${ultimoPedido.cliente.lat},${ultimoPedido.cliente.lon}`;

  const waypoints = [
    origen,
    ...pedidosIntermedios.map(p => `${p.cliente.lat},${p.cliente.lon}`),
    destino,
  ].filter(Boolean); // Elimina `null` si `origen` no está definido


    const url = `https://www.google.com/maps/dir/${waypoints.join("/")}`;
    window.open(url, "_blank");
  };





  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-gray-500 text-2xl font-bold mb-1">Repartos Entregados</h2>
       <button
          title ="Actualizar Pendientes"
          onClick={fetchEnvios}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >

          {loading ? "cargando..." : <FaSyncAlt className="text-lg" />}
        </button>
      {envios.map((envio) => {
        const isExpanded = enviosExpandido.has(envio.id);

        return (
          <div key={envio.id} className="mb-8 border rounded-lg shadow p-4 bg-white">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-500">
                  Envío #{envio.id} - {formatearFecha(envio.fechaCreacion)}
                </h3>
                <p className="text-sm text-gray-600">
                 <strong> Móvil:</strong> {envio.envioPedido?.[0]?.movil?.nombreMovil} -
                  Chofer: {envio.envioPedido?.[0]?.movil?.nombreChofer} -
                   Chapa: {envio.envioPedido?.[0]?.movil?.chapaMovil} |
                   <strong> Cantidad pedidos:</strong>  {envio.envioPedido.length} |
                   <strong> Distancia:</strong>  {envio.kmCalculado} |
                   <strong> Tiempo estimado:</strong>  {envio.tiempoCalculado}
                </p>
              </div>
              <button
                onClick={() => toggleEnvioExpandido(envio.id)}
                className="text-sm text-blue-600 underline"
              >
                {isExpanded ? 'Colapsar' : 'Expandir'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">

              <button
                onClick={() => handleImprimirEnvio(envio)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Imprimir pedidos
              </button>
              <button
                  onClick={() => handleImprimirProductos(envio)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Imprimir productos
                </button>
                <button
                    onClick={() => handleImprimirPlanilla(envio)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                  >
                    Imprimir Planilla de Rendición
                </button>
                <button
                  onClick={() => handleVerEnGoogleMaps(envio)}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
                >
                  Ver en Google Maps
                </button>

            </div>

            {isExpanded && (
              <div>
                {envio.envioPedido
                  .sort((a, b) => a.ordenEnvio - b.ordenEnvio)
                  .map(({ pedido, ordenEnvio, movil }) => {
                    const productosExpandidos = productosExpandidoPorPedido[pedido.id] ?? false;
                    const productosMostrar = productosExpandidos ? pedido.detalles : pedido.detalles.slice(0, 2);

                    return (
                      <div key={pedido.id} className="border p-4 mb-4 rounded shadow text-gray-500 bg-gray-50">
                        <h4 className="text-md font-bold mb-2">#{ordenEnvio} - Pedido #{pedido.id}</h4>
                        <p><strong>Cliente:</strong> {pedido.clienteNombre}</p>
                        <p><strong>RUC:</strong> {pedido.cliente?.ruc}</p>
                        <p><strong>Ciudad:</strong> {pedido.cliente?.ciudad}</p>
                        <p><strong>Dirección:</strong> {pedido.cliente?.direccion}</p>
                        <p><strong>Chofer:</strong> {movil.nombreChofer} ({movil.telefonoChofer})</p>
                        <p><strong>Observaciones:</strong> {pedido.observaciones || "Sin observaciones"}</p>
                        <p><strong>Vendedor:</strong> {pedido.vendedorNombre}</p>
                        <p><strong>Estado:</strong>
                          <span className={`ml-2 px-2 py-1 rounded text-white font-semibold ${
                            pedido.estado === 'pendiente'
                              ? 'bg-orange-500'
                              : pedido.estado === 'entregado'
                              ? 'bg-green-600'
                              : 'bg-blue-400'
                          }`}>
                            {pedido.estado}
                          </span>
                        </p>
                        <p><strong>Total:</strong> {Number(pedido.total).toLocaleString("es-PY", { style: "currency", currency: "PYG" })}</p>

                        <h5 className="mt-3 font-semibold">Productos</h5>
                        <ul className="list-disc pl-6">
                          {productosMostrar.map((d) => (
                            <li key={d.id}>
                              {d.producto.nombre} - Cant: {d.cantidad} - Precio: {Number(d.precioUnitario).toLocaleString("es-PY", {
                                style: "currency",
                                currency: "PYG",
                              })}
                            </li>
                          ))}
                        </ul>
                        {pedido.detalles.length > 2 && (
                          <button
                            onClick={() => toggleProductosPedido(pedido.id)}
                            className="mt-2 text-sm text-gray-400 underline"
                          >
                            {productosExpandidos ? 'Ver menos...' : 'Ver más...'}
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
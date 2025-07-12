// app/components/enviosPendientesView.tsx
"use client";

import { useEffect, useState } from "react";
import { guardaEstadoPedido, getEnvios, guardarEstadoPedido } from "@/app/services/stockService"; // Asegúrate de que estos endpoints existan
import { EnvioHeader } from "../../../types";
import { FaSyncAlt } from "react-icons/fa";


export default function PedidosEntregadosView() {
  const [envios, setEnvios] = useState<EnvioHeader[]>([]);
  const [enviosExpandido, setEnviosExpandido] = useState<Set<number>>(new Set());
  const [productosExpandidoPorPedido, setProductosExpandidoPorPedido] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);


    const fetchEnvios = async () => {
      setLoading(true);
      try {
        const data = await getEnvios("entregado");
        setEnvios(data);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEnvios("entregado"); // Asegúrate de que este endpoint exista y retorne envíos pendientes
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



  const handleImprimirEnvio = (envio: EnvioHeader) => {
    const win = window.open('', '_blank');
    if (!win) return;
    let totalEnvio = 0;
    const contenido = `
      <html>
        <head>
          <title>Envío #${envio.id}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h2 { margin-top: 0; }
            .pedido { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
          </style>
        </head>
        <body>
          <h2>Envío #${envio.id}</h2>
          <p><strong>Fecha:</strong> ${new Date(envio.fechaCreacion).toLocaleString()}</p>
          <p><strong>Móvil:</strong> ${envio.envioPedido[0]?.movil?.nombreMovil} - Chofer: ${envio.envioPedido[0]?.movil?.nombreChofer} - Chapa: ${envio.envioPedido[0]?.movil?.chapaMovil}</p>
          <p><strong>Cantidad pedidos:</strong> ${envio.envioPedido.length}</p>
          <p><strong>Distancia:</strong> ${envio.kmCalculado || ""}</p>
          <p><strong>Tiempo estimado:</strong> ${envio.tiempoCalculado || ""}</p>
          ${envio.envioPedido.map((ep) => {
            const p = ep.pedido;
            totalEnvio += Number(p.total);
            return `
              <div class="pedido">
                <h3>Pedido #${p.id}</h3>
                <p><strong>Cliente:</strong> ${p.clienteNombre} - ${p.cliente?.ruc}</p>
                <p><strong>Dirección:</strong> ${p.cliente?.direccion} - ${p.cliente?.ciudad}</p>
                <p><strong>Ciudad:</strong> ${p.cliente?.ciudad}</p>
                <p><strong>Observaciones:</strong> ${p.observaciones || "Sin observaciones"}</p>
                <p><strong>Total:</strong> ${Number(p.total).toLocaleString('es-PY', {
                  style: 'currency',
                  currency: 'PYG'
                })}</p>
                 <h3>Productos:</h3>
                <ul>
                  ${p.detalles.map(d => `
                    <li>${d.producto?.nombre} - Cant: ${d.cantidad} - Precio: ${Number(d.precioUnitario).toLocaleString('es-PY', {
                      style: 'currency',
                      currency: 'PYG'
                    })}</li>
                  `).join('')}
                </ul>
              </div>
           </h1>
            `;
          }).join('')}
       <h2>Total pedidos: ${Number(totalEnvio).toLocaleString('es-PY', {
                style: 'currency',
                currency: 'PYG'
              })}
          <script>window.print();</script>
        </body>
      </html>
    `;

    win.document.write(contenido);
    win.document.close();
  };




  const handleImprimirProductos = (envio: EnvioHeader) => {
    const productosMap = new Map<string, { nombre: string; cantidad: number }>();

    envio.envioPedido.forEach(ep => {
      ep.pedido.detalles.forEach(det => {
        const nombre = det.producto?.nombre ?? "Sin nombre";
        const key = nombre.toLowerCase(); // clave única para consolidar

        if (!productosMap.has(key)) {
          productosMap.set(key, { nombre, cantidad: det.cantidad });
        } else {
          productosMap.get(key)!.cantidad += det.cantidad;
        }
      });
    });

    const productosHTML = Array.from(productosMap.values())
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(p => `<li>${p.nombre} - Cantidad total: ${p.cantidad}</li>`)
      .join('');

    const win = window.open('', '_blank');
    if (!win) return;

    const contenido = `
      <html>
        <head>
          <title>Productos del Envío #${envio.id}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h2 { margin-top: 0; }
          </style>
        </head>
        <body>
          <h2>Productos del Envío #${envio.id}</h2>
          <p><strong>Fecha:</strong> ${new Date(envio.fechaCreacion).toLocaleString()}</p>
            <p><strong>Móvil:</strong> ${envio.envioPedido[0]?.movil?.nombreMovil} - Chofer: ${envio.envioPedido[0]?.movil?.nombreChofer} - Chapa: ${envio.envioPedido[0]?.movil?.chapaMovil}</p>
          <ul>${productosHTML}</ul>
          <script>window.print();</script>
        </body>
      </html>
    `;

    win.document.write(contenido);
    win.document.close();
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


    const origen = envio.inicioRutaLat && envio.inicioRutaLon ? `${envio.inicioRutaLat},${envio.inicioRutaLon}` : null;
    const destino = envio.finRutaLat && envio.finRutaLon ? `${envio.finRutaLat},${envio.finRutaLon}` : null;
    // Limitar a los waypoints permitidos por Google

    const waypoints = [
      origen,
      ...pedidosOrdenados.map(p => `${p.cliente.lat},${p.cliente.lon}`),
      destino,
    ];
    console.log("Waypoints:", waypoints);

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
                  Envío #{envio.id} - {new Date(envio.fechaCreacion).toLocaleString()}
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
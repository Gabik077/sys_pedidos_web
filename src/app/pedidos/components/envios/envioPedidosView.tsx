"use client";

import { useEffect, useState } from "react";
import { getEnvioById, getPedidos, insertEnvioPedidos, updateEnvio } from "@/app/services/pedidosService";
import dynamic from "next/dynamic";
import DropdownMovil from "./DropdownMovil";
import PedidoItem from "../pedidos/PedidoItem";
import ListaRutaOrdenada from "./ListaRutaOrdenada";
import type { Ciudad, Pedido, ZonaCliente } from "../../../types";
import { FaSyncAlt } from "react-icons/fa";
import { useUser } from "@/app/context/UserContext";
import DropdownCiudad from "./DropdownCiudad";
import { fetchZonaCliente } from "@/app/services/clientService";

const MapaConPedidos = dynamic(() => import("./MapaConPedidos"), {
  ssr: false,
});

function tieneClientesRepetidos(pedidos: Pedido[]): boolean {
  const ids = pedidos.map(p => p.cliente.id);
  const idsUnicos = new Set(ids);
  return ids.length !== idsUnicos.size;
}

function truncarCoord(coord: string | number): string {
  const str = coord.toString().replace(",", ".");
  const [entero, decimal] = str.split(".");
  return decimal ? `${entero}.${decimal.slice(0, 3)}` : str;
}

function tieneLaUbicacionDeInicio(pedidos: Pedido[], origenLat: number, origenLon: number): boolean {
  const latInicio = truncarCoord(origenLat);
  const lonInicio = truncarCoord(origenLon);

  const coincide = pedidos.some(pedido => {
    const latCliente = truncarCoord(pedido.cliente.lat || "");
    const lonCliente = truncarCoord(pedido.cliente.lon || "");
    return latCliente === latInicio && lonCliente === lonInicio;
  });

  if (coincide) {
    alert("⚠️ La ubicación de inicio coincide con la ubicación de un cliente.");
  }

  return coincide;
}

function tieneLatLonDuplicados(pedidos: Pedido[]): boolean {
  const latLonSet = new Set();
  for (const pedido of pedidos) {
    const latLon = `${truncarCoord(pedido.cliente.lat)},${truncarCoord(pedido.cliente.lon)}`;

    if (latLonSet.has(latLon)) {
      alert(`El cliente ${pedido.cliente.nombre} tiene coordenadas duplicadas con otro cliente en esta lista.`);
      return true; // Encontrado un duplicado
    }
    latLonSet.add(latLon);
  }

  return false; // No se encontraron duplicados
}


export default function EnvioPedidosView() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosSeleccionados, setPedidosSeleccionados] = useState<Pedido[]>([]);//para mostrar en el mapa
  const [movilSeleccionado, setMovilSeleccionado] = useState<number | null>(null);
  const [origenLat, setOrigenLat] = useState<string>("-25.366594304094598");// Valor por defecto para pruebas
  const [origenLon, setOrigenLon] = useState<string>("-57.5892038538108"); // Valor por defecto para pruebas
  const [calcularRuta, setCalcularRuta] = useState<boolean>(false);
  const [filtroFecha, setFiltroFecha] = useState<string>("");
  const [pedidosOrdenados, setPedidosOrdenados] = useState<Pedido[]>([]);//para listar ruta ordenada
  const [loading, setLoading] = useState(false);
  const [totalesCalculados, setTotalesCalculados] = useState<{ distancia: string; duracion: string }>({ distancia: "", duracion: "" });
  const [envioIdEditar, setEnvioIdEditar] = useState<string>("");
  const [envioIdCargado, setEnvioIdCargado] = useState<number | null>(null);
  const [mostrarBotonGuardar, setMostrarBotonGuardar] = useState(true);
  const [mostrarBotonEditar, setMostrarBotonEditar] = useState(false);
  const [filterEnvioButtonDisabled, setFilterEnvioButtonDisabled] = useState(false);
  const [ciudad, setCiudad] = useState<string | null>(null);
  const [pedidosFiltradosCiudad, setPedidosFiltradosCiudad] = useState<Pedido[]>([]); // lista filtrada (la que se muestra)
    const [pedidosFiltradosZona, setPedidosFiltradosZona] = useState<Pedido[]>([]); // lista filtrada (la que se muestra)

    const [zonas, setZonas] = useState<ZonaCliente[]>([]);
    const [zona, setZona] = useState(0);


  const { token } = useUser();

  if (!token) {
    window.location.href = "/login";
    return null; // Evitar renderizado adicional si no hay token
  }

const handleCiudad = (ciudadId: number, ciudadNombre: string) => {
  setCiudad(ciudadNombre);
  //filter pedidos by ciudad
  const pedidosFiltrados = pedidos.filter(pedido => pedido.cliente.ciudad.toLowerCase() === ciudadNombre.toLowerCase());

  setPedidosFiltradosCiudad(pedidosFiltrados);


};

const fetchZonas = async () => {
  try {
    const zonas = await fetchZonaCliente(token || "");
    if (Array.isArray(zonas)) {
      setZonas(zonas);
    } else {
      console.error("Respuesta inesperada de /zona-cliente", zonas);
      setZonas([]);
    }
  } catch (error) {
    console.error("Error al cargar zonas:", error);
    setZonas([]);
  }
};

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const pedidos = await getPedidos(token,"pendiente");
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
        const pedidos = await getPedidos(token,"pendiente");
        setPedidos(pedidos);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
      }
    };

    fetchPedidos();
    fetchZonas();
  }, []);

  const togglePedido = (pedido: Pedido) => {
    setPedidosSeleccionados((prev) => {
      if (prev.find((p) => p.id === pedido.id)) {
        return prev.filter((p) => p.id !== pedido.id);
      }
      return [...prev, pedido];
    });
  };

  const handleActualizarPedidos = async () => {
    setFilterEnvioButtonDisabled(false);//deshabilita el botón de filtro
    setPedidos([]);
    setPedidosSeleccionados([]);
    setPedidosOrdenados([]);
    setPedidosOrdenados([]);
    setZona(0);
    setCalcularRuta(false);
    setTotalesCalculados({ distancia: "", duracion: "" });
    setEnvioIdEditar("");
    setEnvioIdCargado(null);
    setMostrarBotonEditar(false); // lo desactiva
    setMostrarBotonGuardar(true); // lo activa
    fetchPedidos();
  }

  const fetchEnvioPorId = async () => {
  if (!envioIdEditar) return alert("Ingrese un ID de envío");
  //limpiar pedidos seleccionados y ordenados
  setFilterEnvioButtonDisabled(true);//deshabilita el botón de filtro
  setPedidosSeleccionados([]);
  setPedidosOrdenados([]);
  setEnvioIdCargado(null);
  setMostrarBotonEditar(true); // lo desactiva
  setMostrarBotonGuardar(false); // lo desactiva
  await fetchPedidos();

  try {
    const data = await getEnvioById(token, parseInt(envioIdEditar), "pendiente");

    if (Array.isArray(data) && data.length > 0) {
      const envio = data[0];

      // Cargar los pedidos
      const pedidosAEditar = envio.envioPedido.map((ep: any) => ep.pedido);
      setPedidosSeleccionados(pedidosAEditar);

      const pedidosMezclados = [ ...pedidosAEditar, ...pedidos];
      setPedidos(pedidosMezclados);

      // Cargar móvil
      setMovilSeleccionado(Number(envio.envioPedido[0]?.idMovil) || null);

      // Setear ID del envío cargado para editar luego
      setEnvioIdCargado(envio.id);
    } else {
      handleActualizarPedidos(); // Limpiar todo si no se encuentra el envío
      alert("No se encontró el envío.");
    }
  } catch (err) {
    console.error("Error al obtener envío:", err);
    alert("Error al obtener el envío.");
  }
};
const handleEditarEnvio = async () => {
  if (!envioIdCargado || envioIdCargado === 0) {
    alert("No se ha cargado un envío para editar.");
    return;
  }

  if (!pedidosOrdenados.length || !movilSeleccionado || !totalesCalculados.distancia || !totalesCalculados.duracion) {
    alert("Faltan datos para editar el envío.");
    return;
  }

  const pedidoDestino = pedidosOrdenados[pedidosOrdenados.length - 1];

  const data = {
    idEnvio: envioIdCargado,
    idMovil: movilSeleccionado,
    pedidos: pedidosOrdenados.map((p) => p.id),
    kmCalculado: totalesCalculados.distancia,
    tiempoCalculado: totalesCalculados.duracion,
    origenLat: parseFloat(origenLat),
    origenLon: parseFloat(origenLon),
    destinoLat: pedidoDestino.cliente?.lat ?? 0.0,
    destinoLon: pedidoDestino.cliente?.lon ?? 0.0,
  };

  try {
    const result = await updateEnvio(token, envioIdCargado, data);

    if (result.status === "ok") {
      alert("Envío editado exitosamente.");
      setEnvioIdEditar("");
      setEnvioIdCargado(null);
      setPedidosSeleccionados([]);
      setPedidosOrdenados([]);
      handleActualizarPedidos(); // Refrescar lista de pedidos
    } else {
      alert("Error al editar el envío: " + result.message);
    }
  } catch (err) {
    console.error("Error al editar el envío:", err);
    alert("Error al editar el envío.");
  }
};

const handleZona = (zonaId: number) => {
  setZona(zonaId);
  if (zonaId === 1 || zonaId === 0) {
    setPedidos(pedidos); // Mostrar todos los pedidos filtrados por ciudad
  } else {
    const pedidosFiltrados = pedidos.filter(pedido => pedido.cliente.zona?.id === zonaId);
    setPedidosFiltradosZona(pedidosFiltrados);
  }
};

  const handleGuardarEnvio = async () => {
    if (!pedidosSeleccionados || !origenLat || !origenLon || pedidosSeleccionados.length === 0) {
      alert("Completa todos los campos y selecciona al menos un pedido.");
      return;
    }
    if(movilSeleccionado === 0 ){
      alert("Selecciona un móvil válido.");
      return;
    }
    if(pedidosSeleccionados ===null || pedidosSeleccionados.length === 0 || totalesCalculados.distancia === "" || totalesCalculados.duracion === ""){
      alert("Calcula la ruta antes de guardar el envío.");
      return;
    }

    if(pedidosSeleccionados.length === 0){
      alert("Selecciona al menos 2 pedidos para el envío.");
      return;

    }


    const pedidoDestino = pedidosOrdenados[pedidosOrdenados.length - 1];

    const data = {
      idMovil: movilSeleccionado,
      pedidos: pedidosOrdenados.map((p) => p.id),
      kmCalculado: totalesCalculados.distancia,
      tiempoCalculado: totalesCalculados.duracion,
      origenLat: origenLat ? parseFloat(origenLat) : 0.0,
      origenLon: origenLon ? parseFloat(origenLon) : 0.0,
      destinoLat: pedidoDestino.cliente?.lat ?? 0.0,
      destinoLon: pedidoDestino.cliente?.lon ?? 0.0,
    };


    const envio = await insertEnvioPedidos(token,data);

    if (envio.status === "ok") {
      alert("Envío guardado exitosamente.");
      setPedidosSeleccionados([]);
      setPedidosOrdenados([]);
      setCalcularRuta(false); // Reiniciar cálculo de ruta
      fetchPedidos(); // Refrescar lista de pedidos
    } else {
      alert("Error al guardar el envío: " + envio.message);
    }

    console.log("Guardando envío:", data);
    // Aquí deberías hacer la llamada a la API para guardar el envío
  };

  const handleCalcularRuta = () => {
  if(tieneClientesRepetidos(pedidosSeleccionados)) {
    alert("⚠️ Hay Clientes repetidos en los pedidos seleccionados. Esto puede causar problemas al calcular la ruta.");
    return;

  }
  if(tieneLatLonDuplicados(pedidosSeleccionados)) {
    return;
  }
  if(tieneLaUbicacionDeInicio(pedidosSeleccionados, parseFloat(origenLat), parseFloat(origenLon))) {
    return;
  }

  setCalcularRuta(true);

  };

  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-bold mb-1 text-gray-500">Crear Reparto</h2>
      <h3 className="text-gray-500"> Distancia : {totalesCalculados.distancia === "" ? "0" : totalesCalculados.distancia }   -  Tiempo: {totalesCalculados.duracion === "" ? "0" : totalesCalculados.duracion}</h3>
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-center">

      <input
        type="text"
        placeholder="ID Envío"
        value={envioIdEditar}
        onChange={(e) => setEnvioIdEditar(e.target.value)}
        className="border rounded px-3 py-1.5 w-full md:w-22"
      />

        <button
          id="cargar-envio"
          onClick={fetchEnvioPorId}
          className={`px-4 py-2 rounded text-white ${
            filterEnvioButtonDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
          disabled={filterEnvioButtonDisabled}
        >
          Cargar Envío
        </button>

        <button
          title="Actualizar Pedidos"
          onClick={handleActualizarPedidos}
          className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >

          {loading ? "cargando..." : <FaSyncAlt className="text-lg" />}
        </button>


  {/*<input
    type="date"
    value={filtroFecha}
    onChange={(e) => setFiltroFecha(e.target.value)}
    className="border rounded px-3 py-2"
  /> */}
              <div className="col-span-1">

            <select
              value={zona}
              onChange={(e) => handleZona(Number(e.target.value))}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Zonas</option>
              {zonas.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.nombre}
                </option>
              ))}
            </select>
          </div>
        <DropdownCiudad onSelect={(id, nombre) => handleCiudad(id,nombre)} />
        <DropdownMovil onSelect={(id) => setMovilSeleccionado(id)} />
        <input
          type="text"
          placeholder="Latitud de origen"
          value={origenLat}
          onChange={(e) => setOrigenLat(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-46"
        />
        <input
          type="text"
          placeholder="Longitud de origen"
          value={origenLon}
          onChange={(e) => setOrigenLon(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-46"
        />
      {mostrarBotonGuardar && (
        <button
          id="guardar-envio"
          onClick={handleGuardarEnvio}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar Envío
        </button>
        )}
      {mostrarBotonEditar && (
      <button
        onClick={handleEditarEnvio}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Editar Envío
      </button>
    )}
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


        if (ciudad && ciudad !== "todas" && pedido.cliente.ciudad.toLowerCase() !== ciudad.toLowerCase()) {
          return false;
        }

        if (zona && zona !== 0 && pedido.cliente.zona?.id !== zona) {
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

       {/* <div className="h-[75vh]">
          <MapaConPedidos
            pedidos={pedidosSeleccionados}
            origen={{ lat: parseFloat(origenLat), lng: parseFloat(origenLon) }}
            calcularRuta={calcularRuta}
            onOrdenOptimizado={(ordenados) => setPedidosOrdenados(ordenados)}
          />
        </div> */}

<div className="h-[75vh]">
        <ListaRutaOrdenada
         pedidos={pedidosSeleccionados}
          origen={{ lat: parseFloat(origenLat), lng: parseFloat(origenLon) }}
          calcularRuta={calcularRuta}
          onTotalesCalculados={(totales) =>{ setCalcularRuta(false); setTotalesCalculados(totales);}}
          onRutaOptimizada={(ordenados) => setPedidosOrdenados(ordenados)}
          />
        </div>
      </div>


    </div>
  );
}

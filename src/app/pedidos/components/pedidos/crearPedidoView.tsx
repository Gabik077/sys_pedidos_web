"use client";

import {  fetchProductsStock, insertPedido } from "@/app/services/stockService";
import { fetchClients } from "@/app/services/clientService";
import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import DropdownVendedores from "./dropdownVendedores";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_venta: string;
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  ruc?: string;
  lat?: string;
  lon?: string;
  direccion?: string;
  ciudad?: string;
}

  interface ProductoSeleccionado {
    id_producto: number;
    cantidad: number;
  }

interface ProductoSeleccionado {
  id_producto: number;
  cantidad: number;
}

export default function CrearPedidoView() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState<number | null>(null);
  const [busqueda, setBusquedaProducto] = useState("");
  const [productoFiltrado, setProductoFiltrado] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const { token } = useUser();

  if (!token) {
    window.location.href = "/login";
    return null; // Evitar renderizado adicional si no hay token
  }

  const [formData, setFormData] = useState({
    tipo_origen: "pedido",
    observaciones: "",
    id_cliente: 1,
    cliente_nombre: "",
    cliente_ciudad: "",
    cliente_direccion: "",
    vendedorId: 1,
    cliente_ruc: "",
    pedido:  {
        id_cliente: 0,
        cliente_nombre:  "",
        estado: "pendiente", // Estado del pedido
        chofer: "", // Campo opcional para el chofer
      },
    productos: [] as ProductoSeleccionado[],
  });


  useEffect(() => {
    const fetchData = async () => {
      const productos = await fetchProductsStock(token);
      const clientes = await fetchClients(token);
      setProductos(productos);
      setClientes(clientes);
    };
    fetchData();
  }, []);


  const formatCurrency = (value: number | string) => {
    return parseFloat(value.toString()).toLocaleString("es-PY", {
      style: "currency",
      currency: "PYG",
    });
  };


  const agregarProducto = () => {
    if (productoFiltrado && cantidad > 0) {
      const yaExiste = formData.productos.some(p => p.id_producto === productoFiltrado.id);
      if (yaExiste) {
        alert("El producto ya está agregado al pedido.");
        return;
      }


      setFormData((prev) => ({
        ...prev,
        productos: [...prev.productos, { id_producto: productoFiltrado.id, cantidad }],
      }));
      setBusquedaProducto("");
      setProductoFiltrado(null);
      setCantidad(1);
    }
  };

  const quitarProducto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index),
    }));
  };

  const calcularTotal = () => {
    return formData.productos.reduce((acc, item) => {
      const producto = productos.find((p) => p.id === item.id_producto);
      return acc + (producto ? parseFloat(producto.precio_venta) * item.cantidad : 0);
    }, 0);
  };

  const calcularIVA = () => {
    return calcularTotal() / 11;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(formData.productos.length === 0) {
      alert("Debe agregar al menos un producto al pedido");
      return;
    }
    if (!formData.id_cliente || !formData.cliente_nombre) {
      alert("Debe seleccionar un cliente antes de registrar el pedido");
      return;
    }
    const dataToSend = {
        tipo_origen: "pedido",
        id_origen: 1,
        observaciones: formData.observaciones,
        total_venta: calcularTotal(),
        vendedorId: vendedorSeleccionado || 1,// Default to 1 if no vendor is selected
        iva: calcularIVA(),
        pedido: {
          id_cliente: formData.id_cliente,
          cliente_nombre: formData.cliente_nombre,
          estado: "pendiente",
          chofer: formData.pedido.chofer,
        },
        productos: formData.productos,
      };

    const result = await insertPedido(token,dataToSend);
    console.log("Resultado:", result);

    if (result.status === "ok") {
      alert("Pedido registrado con exito");
      setFormData({
        tipo_origen: "pedido",
        observaciones: "",
        id_cliente: 1,
        vendedorId: 1,
        cliente_direccion: "",
        cliente_ciudad: "",
        cliente_nombre: "",
        cliente_ruc: "",
        productos: [],
        pedido:  {
            id_cliente: 0,
            cliente_nombre: "",
            estado: "pendiente", // Estado del pedido
            chofer: "", // Campo opcional para el chofer
          },
      });
      setBusquedaProducto("");
      setProductoFiltrado(null);
      setCantidad(1);
      setBusquedaCliente("");
    } else {
      alert(result.message || "Error al registrar pedido");
    }
  };

  const productosSugeridos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const clientesSugeridos = clientes.filter((cli) =>
    `${cli.nombre} ${cli.apellido}`.toLowerCase().includes(busquedaCliente.toLowerCase())
  );


  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-auto bg-white rounded shadow text-gray-500">
      <h2 className="text-2xl font-bold mb-6 text-gray-500">Nuevo Pedido</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ">
  <div>
    <label className="block">Buscar Cliente</label>
    <div className="relative">
      <input
        type="text"
        placeholder="Nombre del cliente"
        value={busquedaCliente}
        onChange={(e) => setBusquedaCliente(e.target.value)}
         onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }}}
        className="w-full border p-2 rounded"
      /><p>Vendedor:</p>
      <DropdownVendedores  onSelect={(id) => setVendedorSeleccionado(id)} />
      {busquedaCliente && clientesSugeridos.length > 0 && (
        <ul className="absolute bg-white border w-full max-h-48 overflow-y-auto z-10 rounded shadow">
          {clientesSugeridos.map((cli) => (
            <li
              key={cli.id}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                setFormData({
                  ...formData,
                  id_cliente: cli.id,
                  cliente_nombre: `${cli.nombre} ${cli.apellido}`,
                  cliente_ruc: cli.ruc || "",
                  cliente_direccion: cli.direccion || "",
                  cliente_ciudad: cli.ciudad || "",
                });
                setBusquedaCliente("");
              }}
            >
              {cli.nombre} {cli.apellido}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>


  <div className="mb-6">
        <label className="block">Observaciones</label>
        <textarea
          value={formData.observaciones}
          onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
          className="w-full border p-2 rounded"
        ></textarea>
      </div>

</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block">Nombre del Cliente</label>
          <input type="text" value={formData.cliente_nombre} className="w-full border p-2 rounded" disabled />
        </div>

        <div>
          <label className="block">RUC</label>
          <input type="text" value={formData.cliente_ruc} className="w-full border p-2 rounded" disabled />
        </div>

        <div>
          <label className="block">Dirección</label>
          <input type="text" value={formData.cliente_direccion} className="w-full border p-2 rounded" disabled />
        </div>

        <div>
          <label className="block">Ciudad</label>
          <input type="text" value={formData.cliente_ciudad} className="w-full border p-2 rounded" disabled />
        </div>
      </div>


      <h3 className="font-semibold text-lg mb-2">Agregar Producto</h3>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar producto"
            value={busqueda}
            onChange={(e) => {
              setBusquedaProducto(e.target.value);
              setProductoFiltrado(null);
            }}
             onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            className="border p-2 rounded w-full"
          />
          {busqueda && productosSugeridos.length > 0 && (
            <ul className="absolute bg-white border w-full max-h-48 overflow-y-auto z-10 rounded shadow">
              {productosSugeridos.map((prod) => (
                <li
                  key={prod.id}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setProductoFiltrado(prod);
                    setBusquedaProducto(prod.nombre);
                  }}
                >
                  {prod.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className="w-24 border p-2 rounded"
          min={1}
        />
        <button type="button" onClick={agregarProducto} className="bg-blue-500 text-white px-4 py-2 rounded">
          Agregar
        </button>
      </div>

      <ul className="mb-4">
        {formData.productos.map((p, idx) => {
          const producto = productos.find((prod) => prod.id === p.id_producto);
          return (
            <li key={idx} className="flex flex-col md:flex-row md:justify-between md:items-center border p-2 rounded mb-1 gap-2">
              <span>{producto?.nombre}</span>
              <span>Cantidad: {p.cantidad}</span>
              <span>Precio unitario: {producto ? formatCurrency(producto.precio_venta) : ""}</span>
             <button
                type="button"
                onClick={() => quitarProducto(idx)}
                className="text-red-600 hover:underline"
              >
                Quitar
              </button>

            </li>
          );
        })}
      </ul>

      <div className="mb-4 font-bold">Total: {formatCurrency(calcularTotal())}</div>
      <div className="mb-4 font-bold">IVA (10%): {formatCurrency(calcularIVA())}</div>

      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
        Registrar Pedido
      </button>
    </form>
  );
}

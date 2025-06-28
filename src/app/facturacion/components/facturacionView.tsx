"use client";

import { fetchProductsStock, fetchClients, insertSalidaStock } from "@/app/services/stockService";
import { useEffect, useState } from "react";

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
}

interface ProductoSeleccionado {
  id_producto: number;
  cantidad: number;
}

export default function FacturacionView() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [formData, setFormData] = useState({
    tipo_origen: "venta",
    observaciones: "",
    id_cliente: 1,
    cliente_nombre: "",
    cliente_ruc: "",
    metodo_pago: "efectivo", // ✅ nuevo campo
    productos: [] as ProductoSeleccionado[],
  });


  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [productoFiltrado, setProductoFiltrado] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      const productos = await fetchProductsStock();
      setProductos(productos);
      const clientes = await fetchClients();
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
      setFormData((prev) => ({
        ...prev,
        productos: [...prev.productos, { id_producto: productoFiltrado.id, cantidad }],
      }));
      setBusqueda("");
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

  const calcularIVA = () => calcularTotal() / 11;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      tipo_origen: formData.tipo_origen,
      id_origen: 1,
      observaciones: formData.observaciones,
      total_venta: calcularTotal(),
      iva: calcularIVA(),
      venta: {
        id_cliente: formData.id_cliente || null,
        metodo_pago: formData.metodo_pago || "efectivo",
      } ,
      productos: formData.productos,
    };

    const result = await insertSalidaStock(dataToSend);
    console.log("Resultado:", result);

    if (result.status === "ok") {
      alert("Factura registrada correctamente");
      setFormData({
        tipo_origen: "facturacion",
        observaciones: "",
        id_cliente: 0,
        cliente_nombre: "",
        metodo_pago: "efectivo",
        cliente_ruc: "",
        productos: [],
      });
      setBusqueda("");
      setProductoFiltrado(null);
      setCantidad(1);
      setBusquedaCliente("");
    } else {
      alert(result.message || "Error al registrar la factura");
    }
  };

  const productosSugeridos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const clientesSugeridos = clientes.filter((cli) =>
    `${cli.nombre} ${cli.apellido}`.toLowerCase().includes(busquedaCliente.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-6xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Formulario de Facturación</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700">Tipo Origen</label>
          <select
            value={formData.tipo_origen}
            onChange={(e) => setFormData({ ...formData, tipo_origen: e.target.value })}
            className="w-full border p-2 rounded">
            <option value="facturacion">Facturacion</option>
          </select>
        </div>

        <div className="mb-4">
            <label className="block text-gray-700">Método de Pago</label>
            <select
                value={formData.metodo_pago}
                onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
                className="w-full border p-2 rounded"
            >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="otro">Otro</option>
            </select>
            </div>
      </div>

      <div className="mb-6">
        <label className="block mb-1">Buscar Cliente</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Nombre del cliente"
            value={busquedaCliente}
            onChange={(e) => setBusquedaCliente(e.target.value)}
            className="w-full border p-2 rounded"
          />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block">Nombre del Cliente</label>
          <input
            type="text"
            value={formData.cliente_nombre}
            onChange={(e) => setFormData({ ...formData, cliente_nombre: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block">RUC del Cliente</label>
          <input
            type="text"
            value={formData.cliente_ruc}
            onChange={(e) => setFormData({ ...formData, cliente_ruc: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2">Agregar Producto</h3>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar producto por nombre"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setProductoFiltrado(null);
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
                    setBusqueda(prod.nombre);
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
              <button onClick={() => quitarProducto(idx)} className="text-red-600 hover:underline">
                Quitar
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mb-4 font-bold">Total: {formatCurrency(calcularTotal())}</div>
      <div className="mb-4 font-bold">IVA (10%): {formatCurrency(calcularIVA())}</div>

      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
        Registrar Factura
      </button>
    </form>
  );
}

"use client";

import { fetchProductsStock } from "@/app/services/stockService";
import { useEffect, useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_venta: string;
}

interface ProductoSeleccionado {
  id_producto: number;
  cantidad: number;
}

interface FormData {
  cliente: string;
  ruc: string;
  direccion: string;
  productos: ProductoSeleccionado[];
  metodo_pago: string;
}

export default function FacturacionView() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [formData, setFormData] = useState<FormData>({
    cliente: "",
    ruc: "",
    direccion: "",
    productos: [],
    metodo_pago: "efectivo",
  });

  const [busqueda, setBusqueda] = useState("");
  const [codigoBusqueda, setCodigoBusqueda] = useState("");
  const [productoFiltrado, setProductoFiltrado] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      const productos = await fetchProductsStock();
      setProductos(productos);
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
      setCodigoBusqueda("");
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
    return formData.productos.reduce((sum, item) => {
      const producto = productos.find((p) => p.id === item.id_producto);
      return sum + (producto ? item.cantidad * parseFloat(producto.precio_venta) : 0);
    }, 0);
  };

  const calcularIVA = () => calcularTotal() / 11;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos de facturación:", formData);
    alert("Factura registrada correctamente");
  };

  const productosSugeridos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const buscarPorCodigo = productos.find(
    (p) => p.descripcion?.toLowerCase().includes(codigoBusqueda.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-6xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Formulario de Facturación</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">Cliente</label>
          <input
            type="text"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">RUC</label>
          <input
            type="text"
            name="ruc"
            value={formData.ruc}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2">Productos</h3>

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
          type="text"
          placeholder="Código interno o de barras"
          value={codigoBusqueda}
          onChange={(e) => {
            setCodigoBusqueda(e.target.value);
            const encontrado = productos.find(p =>
              p.descripcion?.toLowerCase().includes(e.target.value.toLowerCase())
            );
            if (encontrado) {
              setProductoFiltrado(encontrado);
              setBusqueda(encontrado.nombre);
            }
          }}
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className="w-24 border p-2 rounded"
          min={1}
        />
        <button
          type="button"
          onClick={agregarProducto}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Agregar
        </button>
      </div>

      <ul className="mb-4">
        {formData.productos.map((p, idx) => {
          const producto = productos.find((prod) => prod.id === p.id_producto);
          return (
            <li
              key={idx}
              className="flex flex-col md:flex-row md:justify-between md:items-center border p-2 rounded mb-1 gap-2"
            >
              <span>{producto?.nombre}</span>
              <span>Cantidad: {p.cantidad}</span>
              <span>Precio unitario: {producto ? formatCurrency(producto.precio_venta) : ""}</span>
              <button
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

      <div className="mb-4">
        <label className="block text-gray-700">Método de Pago</label>
        <select
          name="metodo_pago"
          value={formData.metodo_pago}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Facturar
      </button>
    </form>
  );
}

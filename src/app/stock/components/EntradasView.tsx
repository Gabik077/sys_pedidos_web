"use client";

import { fetchProveedores } from "@/app/services/productService";
import { fetchProductsStock } from "@/app/services/stockService";
import { useState, useEffect } from "react";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_venta: string;
}

interface Proveedor {
  id: number;
  nombre: string;
}
interface Categoria {
    id: number;
    nombre: string;
  }

interface ProductoSeleccionado {
  id_producto: number;
  cantidad: number;
}

export default function EntradasView() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [categoria, setCategoria] = useState<Categoria[]>([]);

  const [formData, setFormData] = useState({//default values for form
    tipo_origen: "produccion",
    observaciones: "",
    categoria_stock: "1",
    id_proveedor: 1,
    metodo_pago: "efectivo",
    productos: [] as ProductoSeleccionado[],
  });

  const [facturaData, setFacturaData] = useState({
    timbrado: "",
    nro_factura: "",
    fecha_factura: ""
  });

  const [busqueda, setBusqueda] = useState("");
  const [productoFiltrado, setProductoFiltrado] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      const productos = await fetchProductsStock();
      if (productos.status == "invalid_token") {
            alert("Sesión expirada, por favor inicie sesión nuevamente.");
          window.location.href = "/login";
          return;
        }
      setProductos(productos);

      const proveedores = await fetchProveedores();

      setProveedores(proveedores);
    };
    fetchData();
  }, []);

  const formatCurrency = (value: number | string) => {
    return parseFloat(value.toString()).toLocaleString("es-PY", { style: "currency", currency: "PYG" });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      tipo_origen: formData.tipo_origen,
      id_origen: 1,
      observaciones: formData.observaciones,
      categoria_stock: formData.categoria_stock,
      compra: formData.tipo_origen === "compra" ? {
        id_proveedor: formData.id_proveedor,
        total_compra: calcularTotal(),
        estado: "aprobado",
        timbrado: facturaData.timbrado,
        nro_factura: facturaData.nro_factura,
        fecha_factura: facturaData.fecha_factura,
      } : null,
      productos: formData.productos,
    };

    const res = await fetch("http://localhost:4000/stock/entrada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dataToSend),
    });
    if (!res.ok) {
      console.error("Error:", res.statusText);
      if(res.statusText == "unauthorized") {
        window.location.href = "/login";
        return;
      }
      alert("Error al registrar la entrada:");
      return;
    }

    const result = await res.json();
    console.log("Resultado:", result);
    alert("Entrada registrada con éxito");

    // Limpiar los datos después de enviar
    setFormData({
      tipo_origen: "produccion",
      observaciones: "",
      categoria_stock: "1",
      id_proveedor: 1,
      metodo_pago: "efectivo",
      productos: [],
    });
    setFacturaData({ timbrado: "", nro_factura: "", fecha_factura: "" });
    setBusqueda("");
    setProductoFiltrado(null);
    setCantidad(1);
  };

  const productosSugeridos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Formulario de Entrada</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block">Tipo Origen</label>
          <select
            value={formData.tipo_origen}
            onChange={(e) => setFormData({ ...formData, tipo_origen: e.target.value })}
            className="w-full border p-2 rounded" >
            <option value="produccion">Producción</option>
            <option value="compra">Compra</option>
            <option value="ajuste">Ajuste</option>
            <option value="devolucion">Devolución</option>
            <option value="otros">Otros</option>
          </select>
        </div>


        <div>
          <label className="block">Categoría Stock</label>
          <select
            value={formData.categoria_stock}
            onChange={(e) => setFormData({ ...formData, categoria_stock: e.target.value })}
            className="w-full border p-2 rounded" >
            <option value="1">Stock General</option>
            <option value="2">Materia Prima</option>
            <option value="3">Stock Ventas</option>
          </select>
        </div>

        <div>
          <label className="block">Observaciones</label>
          <textarea
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>
      </div>

      {formData.tipo_origen === "compra" && (
        <div className="mb-6 border p-6 rounded bg-gray-100">
          <h3 className="text-xl font-semibold mb-4">Detalle de Factura</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block">Proveedor</label>
              <select
                value={formData.id_proveedor}
                onChange={(e) => setFormData({ ...formData, id_proveedor: Number(e.target.value) })}
                className="w-full border p-2 rounded"
              >
                {proveedores.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block">Timbrado</label>
              <input
                type="text"
                value={facturaData.timbrado}
                onChange={(e) => setFacturaData({ ...facturaData, timbrado: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block">Nro Factura</label>
              <input
                type="text"
                value={facturaData.nro_factura}
                onChange={(e) => setFacturaData({ ...facturaData, nro_factura: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block">Fecha Factura</label>
              <input
                type="date"
                value={facturaData.fecha_factura}
                onChange={(e) => setFacturaData({ ...facturaData, fecha_factura: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        </div>
      )}

      <h3 className="font-semibold text-lg mb-2">Agregar Producto</h3>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar producto"
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
            <li key={idx} className="flex justify-between items-center border p-2 rounded mb-1">
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

      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
        Registrar Entrada
      </button>
    </form>
  );
}

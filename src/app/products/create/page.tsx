'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct, fetchProveedores, fetchUnidades } from "@/app/services/productService";

function CreateProductPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [iva, setIva] = useState("10");// Valor por defecto del IVA
  const [descripcion, setDescripcion] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stockMinimo, setStockMinimo] = useState("0");
  const [estado, setEstado] = useState("activo");
  const [idMoneda, setIdMoneda] = useState("1"); // Asignar un valor por defecto para la moneda
  const [codigoInterno, setCodigoInterno] = useState("");
  const [idCategoria, setIdCategoria] = useState("1");   // Asignar un valor por defecto para la categoría
  const [idProveedor, setIdProveedor] = useState("");
  const [marca, setMarca] = useState("");
  const [codigoBarra, setCodigoBarra] = useState("");
  const [idUnidad, setIdUnidad] = useState("");
  const [unidades, setUnidades] = useState([]);//lista de unidades
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUnidades, resProveedores] = await Promise.all([
          fetchUnidades(),
          fetchProveedores()
        ]);
        setUnidades(resUnidades);
        setProveedores(resProveedores);
      } catch (err) {
        console.error("Error al cargar unidades o proveedores", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoProducto = {
      nombre,
      descripcion,
      precio_compra: parseFloat(precioCompra),
      precio_venta: parseFloat(precioVenta),
      stock_minimo: parseInt(stockMinimo, 10),
      estado,
      id_moneda: parseInt(idMoneda, 10),
      codigo_interno: codigoInterno,
      id_categoria: parseInt(idCategoria, 10),
      id_proveedor: parseInt(idProveedor, 10),
      marca,
      codigo_barra: codigoBarra,
      id_unidad: parseInt(idUnidad, 10),
      iva: parseInt(iva, 10) || 0, // Asignar IVA, si no se proporciona, por defecto será 0
      sku: "",
    };
console.log("Nuevo producto a crear:", nuevoProducto);
    const res = await createProduct(nuevoProducto);

    if (res.status === "ok") {
      alert("Producto creado con éxito");
      router.push("/products");
    } else {
      alert("Error al crear producto");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Crear Producto</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Nombre</p>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-3 border rounded" required />
          </div>

          <div>
            <p className="text-xs text-gray-500">Marca</p>
            <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} className="w-full p-3 border rounded" />
          </div>

          <div >
            <p className="text-xs text-gray-500">Descripción</p>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full p-1 border rounded" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Estado</p>
            <select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full p-3 border rounded">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div>
            <p className="text-xs text-gray-500">Precio Compra</p>
            <input type="number" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} className="w-full p-3 border rounded" required />
          </div>
          <div>
            <p className="text-xs text-gray-500">Precio Venta</p>
            <input type="number" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} className="w-full p-3 border rounded" required />
          </div>
          <div>
          <p className="text-xs text-gray-500">IVA</p>
          <select value={iva} onChange={(e) => setIva(e.target.value)} className="w-full p-3 border rounded">
              <option value="10">10</option>
              <option value="5">5</option>
              <option value="0">0</option>
            </select>
          </div>


          <div>
            <p className="text-xs text-gray-500">Stock Mínimo</p>
            <input type="number" value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} className="w-full p-3 border rounded" />
          </div>

          <div>
            <p className="text-xs text-gray-500">Moneda</p>
            <select value={idMoneda} onChange={(e) => setIdMoneda(e.target.value)} className="w-full p-3 border rounded">
              <option value="1">Guarani</option>
              <option value="2">Dolar</option>
            </select>
          </div>
          <div>
            <p className="text-xs text-gray-500">Unidad</p>
            <select value={idUnidad} onChange={(e) => setIdUnidad(e.target.value)} className="w-full p-3 border rounded">
              <option value="">Seleccionar unidad</option>
              {unidades.map((u: any) => (
                <option key={u.id} value={u.id}>{u.nombre} ({u.simbolo})</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs text-gray-500">Categoría</p>
            <select value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)} className="w-full p-3 border rounded">
              <option value="1">Varios</option>
              <option value="2">Helados</option>
              <option value="3">Bebidas</option>
              <option value="4">Panificados</option>
            </select>
          </div>

           <div>
            <p className="text-xs text-gray-500">Proveedor</p>
            <select value={idProveedor} onChange={(e) => setIdProveedor(e.target.value)} className="w-full p-3 border rounded">
              <option value="">Seleccionar proveedor</option>
              {proveedores.map((prov: any) => (
                <option key={prov.id} value={prov.id}>{prov.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs text-gray-500">Código Interno</p>
            <input type="text" value={codigoInterno} onChange={(e) => setCodigoInterno(e.target.value)} className="w-full p-3 border rounded" />
          </div>

          <div>
            <p className="text-xs text-gray-500">Código de Barra</p>
            <input type="text" value={codigoBarra} onChange={(e) => setCodigoBarra(e.target.value)} className="w-full p-3 border rounded" />
          </div>


          <button type="submit" className="col-span-2 bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
            Crear Producto
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProductPage;

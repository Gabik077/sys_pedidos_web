'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct, fetchProveedores, fetchUnidades, fetchProducts } from "@/app/services/productService";
import { useUser } from "@/app/context/UserContext";
import { priceFormatter } from "@/app/utils/utils";

interface Producto { id: number; nombre: string; descripcion?: string; precio_venta: number; }
interface ComboDetalle { id_producto: number; cantidad: number; }

export default function CreateProductPage() {
  const router = useRouter();
  const { token } = useUser();
  if (!token) { router.push("/login"); return null; }

  const [unidades, setUnidades] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [todosProductos, setTodosProductos] = useState<Producto[]>([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stockMinimo, setStockMinimo] = useState("0");
  const [estado, setEstado] = useState("activo");
  const [iva, setIva] = useState("10");
  const [idMoneda, setIdMoneda] = useState("1");
  const [codigoInterno, setCodigoInterno] = useState("");
  const [idCategoria, setIdCategoria] = useState("1");
  const [idProveedor, setIdProveedor] = useState("");
  const [marca, setMarca] = useState("");
  const [codigoBarra, setCodigoBarra] = useState("");
  const [idUnidad, setIdUnidad] = useState("");

  const [isCombo, setIsCombo] = useState(false);
  const [busquedaCombo, setBusquedaCombo] = useState("");
  const [productosSugeridosCombo, setProductosSugeridosCombo] = useState<Producto[]>([]);
  const [productoComboFiltrado, setProductoComboFiltrado] = useState<Producto | null>(null);
  const [comboCantidad, setComboCantidad] = useState(1);
  const [comboDetalles, setComboDetalles] = useState<ComboDetalle[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [u, p, prods] = await Promise.all([
        fetchUnidades(token || ""), fetchProveedores(token || ""), fetchProducts(token || "")
      ]);
      setUnidades(u); setProveedores(p); setTodosProductos(prods);
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    if (busquedaCombo) {
      const f = todosProductos.filter(p => p.nombre.toLowerCase().includes(busquedaCombo.toLowerCase()));
      setProductosSugeridosCombo(f);
    } else setProductosSugeridosCombo([]);
  }, [busquedaCombo, todosProductos]);

  const agregarDetalleCombo = () => {
    if (!productoComboFiltrado || comboCantidad < 1) return;
    if (comboDetalles.some(d => d.id_producto === productoComboFiltrado.id)) {
      alert("Producto ya agregado al combo"); return;
    }
    setComboDetalles(prev => [...prev, { id_producto: productoComboFiltrado.id, cantidad: comboCantidad }]);
    setBusquedaCombo(""); setProductoComboFiltrado(null); setComboCantidad(1);
  };

  const quitarDetalle = (idx: number) => setComboDetalles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCombo && comboDetalles.length === 0) {
      alert("Debe agregar al menos un producto al combo."); return;
    }

    const nuevoProducto: any = {
      nombre,
      descripcion,
      precio_compra: parseFloat(precioCompra),
      precio_venta: parseFloat(precioVenta),
      stock_minimo: parseInt(stockMinimo, 10),
      estado,
      id_moneda: parseInt(idMoneda, 10),
      codigo_interno: codigoInterno || undefined,
      id_categoria: parseInt(idCategoria, 10),
      id_proveedor: parseInt(idProveedor, 10),
      marca,
      codigo_barra: codigoBarra,
      id_unidad: parseInt(idUnidad, 10),
      iva: parseInt(iva, 10) || 0,
      sku: "",
    };

    if (isCombo) {
      nuevoProducto.comboData = {
        nombre_combo: nombre,
        descripcion_combo: descripcion,
        id_producto_combo: 0,
        detalles: comboDetalles,
      };
    }

    const res = await createProduct(token, nuevoProducto);
    if (res.status === "ok") {
      alert("Producto creado con éxito");
      router.push("/products");
    } else {
      alert(res.message || "Error al crear elproducto");
    }
  };
  const totalCombo = comboDetalles.reduce((total, item) => {
    const prod = todosProductos.find(p => p.id === item.id_producto);
    const precio = prod?.precio_venta || 0;
    return total + precio * item.cantidad;
  }, 0);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Crear Producto</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          {/* Campos base */}
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

          {/* Selects */}
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
              <option value="2">Balde de 5 litros</option>
              <option value="3">Baldes de 10 litros</option>
              <option value="4">Paletas</option>
              <option value="5">Envasados</option>
              <option value="6">Especiales</option>
              <option value="7">Accesorios</option>
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

          {/* Combo */}
          <div className="col-span-2 mt-2">
            <label className="inline-flex items-center">
              <input type="checkbox" checked={isCombo} onChange={() => setIsCombo(!isCombo)} className="mr-2" />
              Este producto es un Combo
            </label>
          </div>

          {isCombo && (
            <fieldset className="col-span-2 border p-4 mt-4">
  <legend className="font-semibold mb-2">Productos del Combo</legend>

  {/* Buscador, cantidad y botón */}
  <div className="grid grid-cols-12 gap-2 mb-2 items-center">
    <div className="relative col-span-6">
      <input
        type="text"
        placeholder="Buscar producto"
        value={busquedaCombo}
        onChange={e => {
          setBusquedaCombo(e.target.value);
          setProductoComboFiltrado(null);
        }}
        className="border p-2 rounded w-full"
      />
      {busquedaCombo && productosSugeridosCombo.length > 0 && (
        <ul className="absolute bg-white border w-full max-h-32 overflow-y-auto z-10 rounded shadow">
          {productosSugeridosCombo.map(p => (
            <li
              key={p.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setProductoComboFiltrado(p);
                setBusquedaCombo(p.nombre);
              }}
            >
              {p.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className="col-span-3">
      <input
        type="number"
        min={1}
        value={comboCantidad}
        onChange={e => setComboCantidad(Number(e.target.value))}
        className="border p-2 rounded w-full"
      />
    </div>

    <div className="col-span-3">
      <button
        type="button"
        onClick={agregarDetalleCombo}
        className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700"
      >
        Agregar
      </button>
    </div>
  </div>

  {/* Lista de productos agregados */}
  <ul className="mb-2 space-y-2">
    {comboDetalles.map((item, idx) => {
      const prod = todosProductos.find(p => p.id === item.id_producto);
      const precio = prod?.precio_venta || 0;
      return (
        <li key={idx} className="flex justify-between items-center border p-2 rounded text-sm">
          <div className="flex flex-col">
            <span className="font-medium">{prod?.nombre}</span>
            <span className="text-gray-500">
              Cantidad: {item.cantidad} | Precio unitario: {priceFormatter.format(precio)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => quitarDetalle(idx)}
            className="text-red-600 hover:underline"
          >
            Quitar
          </button>
        </li>
      );
    })}
  </ul>

  {/* Total */}
  <div className="text-right font-semibold text-lg mt-4">
    Total del combo: Gs. {totalCombo.toLocaleString("es-PY")}
  </div>
</fieldset>

          )}

          <button type="submit" className="col-span-2 bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700 mt-4">
            Crear Producto
          </button>
        </form>
      </div>
    </div>
  );
}

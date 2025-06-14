'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  fetchProductById,
  updateProductById,
  fetchProveedores,
  fetchUnidades,
} from '@/app/services/productService';
import { withAuth } from '@/app/utils/withAuth';

function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [estado, setEstado] = useState('');
  const [idMoneda, setIdMoneda] = useState('');
  const [codigoInterno, setCodigoInterno] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [idProveedor, setIdProveedor] = useState('');
  const [marca, setMarca] = useState('');
  const [codigoBarra, setCodigoBarra] = useState('');
  const [unidadId, setUnidadId] = useState('');

  const [proveedores, setProveedores] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [proveedoresRes, unidadesRes] = await Promise.all([
          fetchProveedores(),
          fetchUnidades(),
        ]);
        setProveedores(proveedoresRes);
        setUnidades(unidadesRes);
      } catch (err) {
        console.error('Error cargando proveedores o unidades:', err);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const producto = await fetchProductById(id);
        if (!producto) {
          alert('Producto no encontrado');
          return;
        }

        setNombre(producto.nombre || '');
        setDescripcion(producto.descripcion || '');
        setPrecioCompra(String(producto.precio_compra || ''));
        setPrecioVenta(String(producto.precio_venta || ''));
        setStockMinimo(String(producto.stock_minimo || ''));
        setEstado(producto.estado || '');
        setIdMoneda(String(producto.id_moneda || ''));
        setCodigoInterno(producto.codigo_interno || '');
        setIdCategoria(String(producto.id_categoria || ''));
        setIdProveedor(String(producto.id_proveedor || ''));
        setMarca(producto.marca || '');
        setCodigoBarra(producto.codigo_barra || '');
        setUnidadId(String(producto.unidad?.id || ''));
      } catch (err) {
        console.error('Error al cargar producto:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productoActualizado = {
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
      id_unidad: parseInt(unidadId, 10),
    };

    const res = await updateProductById(id, productoActualizado);

    if (res.status === 'ok') {
      alert('Producto actualizado con éxito');
      router.push('/products');
    } else {
      alert('Error al actualizar producto');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Editar Producto</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Nombre</p>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-3 border rounded" required />
            </div>

            <div>
              <p className="text-xs text-gray-500">Marca</p>
              <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} className="w-full p-3 border rounded" />
            </div>

            <div className="col-span-2">
              <p className="text-xs text-gray-500">Descripción</p>
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full p-3 border rounded" />
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
              <p className="text-xs text-gray-500">Stock Mínimo</p>
              <input type="number" value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} className="w-full p-3 border rounded" />
            </div>

            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="activo"
                checked={estado === 'activo'}
                onChange={(e) => setEstado(e.target.checked ? 'activo' : 'inactivo')}
                className="h-4 w-4"
              />
              <label htmlFor="activo" className="ml-2 text-xs text-gray-500">
                Activo
              </label>
            </div>

            <div>
              <p className="text-xs text-gray-500">ID Moneda</p>
              <input type="text" value={idMoneda} onChange={(e) => setIdMoneda(e.target.value)} className="w-full p-3 border rounded" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Código Interno</p>
              <input type="text" value={codigoInterno} onChange={(e) => setCodigoInterno(e.target.value)} className="w-full p-3 border rounded" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Código de Barra</p>
              <input type="text" value={codigoBarra} onChange={(e) => setCodigoBarra(e.target.value)} className="w-full p-3 border rounded" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Categoría</p>
              <input type="text" value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)} className="w-full p-3 border rounded" />
            </div>
{/*
            <div>
              <p className="text-xs text-gray-500">Proveedor</p>
              <select value={idProveedor} onChange={(e) => setIdProveedor(e.target.value)} className="w-full p-3 border rounded">
                <option value="">Seleccione proveedor</option>
                {proveedores.map((prov: any) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <p className="text-xs text-gray-500">Unidad</p>
              <select value={unidadId} onChange={(e) => setUnidadId(e.target.value)} className="w-full p-3 border rounded">
                <option value="">Seleccione unidad</option>
                {unidades.map((unidad: any) => (
                  <option key={unidad.id} value={unidad.id}>
                    {unidad.nombre} ({unidad.simbolo})
                  </option>
                ))}
              </select>
            </div> */}

            <button type="submit" className="col-span-2 bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
              Guardar Cambios
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default withAuth(EditProductPage, ['ADMINISTRADOR']);

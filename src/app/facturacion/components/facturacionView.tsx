import { useState } from "react";

type Producto = {
  nombre: string;
  cantidad: number;
  precio_unitario: number;
};

type FormData = {
  cliente: string;
  ruc: string;
  direccion: string;
  productos: Producto[];
  metodo_pago: string;
};

export default function FacturacionView() {
  const [formData, setFormData] = useState<FormData>({
    cliente: "",
    ruc: "",
    direccion: "",
    productos: [{ nombre: "", cantidad: 1, precio_unitario: 0 }],
    metodo_pago: "efectivo"
  });

  const handleProductChange = (
    index: number,
    field: keyof Producto,
    value: string
  ) => {
    const updatedProducts = [...formData.productos];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: field === 'cantidad' || field === 'precio_unitario' ? Number(value) : value
    };
    setFormData({ ...formData, productos: updatedProducts });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      productos: [...formData.productos, { nombre: "", cantidad: 1, precio_unitario: 0 }]
    });
  };

  const removeProduct = (index: number) => {
    if (formData.productos.length === 1) return;
    const updatedProducts = formData.productos.filter((_, i) => i !== index);
    setFormData({ ...formData, productos: updatedProducts });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const total = formData.productos.reduce((sum, prod) => sum + prod.cantidad * prod.precio_unitario, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos de facturación:", formData);
    alert("Factura registrada correctamente");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Formulario de Facturación</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Cliente</label>
        <input type="text" name="cliente" value={formData.cliente} onChange={handleChange} className="w-full border p-2 rounded" required />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">RUC</label>
        <input type="text" name="ruc" value={formData.ruc} onChange={handleChange} className="w-full border p-2 rounded" required />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Dirección</label>
        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2">Productos</h3>
      {formData.productos.map((prod, index) => (
        <div key={index} className="grid grid-cols-4 gap-4 mb-2 items-center">
          <input
            type="text"
            placeholder="Nombre"
            value={prod.nombre}
            onChange={(e) => handleProductChange(index, 'nombre', e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={prod.cantidad}
            onChange={(e) => handleProductChange(index, 'cantidad', e.target.value)}
            className="border p-2 rounded"
            required
            min="1"
          />
          <input
            type="number"
            placeholder="Precio Unitario"
            value={prod.precio_unitario}
            onChange={(e) => handleProductChange(index, 'precio_unitario', e.target.value)}
            className="border p-2 rounded"
            required
            step="0.01"
          />
          <button
            type="button"
            onClick={() => removeProduct(index)}
            className="text-red-600 hover:text-red-800 text-sm"
            disabled={formData.productos.length === 1}
            title="Eliminar producto"
          >
            🗑️ Eliminar
          </button>
        </div>
      ))}

      <button type="button" onClick={addProduct} className="text-blue-600 underline mb-4">
        + Agregar producto
      </button>

      <div className="mb-4">
        <label className="block text-gray-700">Método de Pago</label>
        <select name="metodo_pago" value={formData.metodo_pago} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>

      <div className="font-bold text-lg mb-4">Total: {total.toFixed(2)} Gs</div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Facturar
      </button>
    </form>
  );
}

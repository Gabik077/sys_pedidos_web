"use client";

import { fetchProductsStock, insertSalidaStock } from "@/app/services/stockService";
import { fetchClients } from "@/app/services/clientService";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { Cliente, Producto } from "@/app/types";
import { formatCurrency, numberFormatter } from "@/app/utils/utils";


interface ProductoSeleccionado {
  id_producto: number;
  cantidad: number;
}

export default function FacturacionView() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const codigoBarraRef = useRef<HTMLInputElement>(null);
  const [bloqueado, setBloqueado] = useState(false);

  const [formData, setFormData] = useState({
    tipo_origen: "venta",
    observaciones: "",
    id_cliente: 1,
    cliente_nombre: "",
    codigo_barra: "",
    cliente_ruc: "",
    metodo_pago: "efectivo",
    productos: [] as ProductoSeleccionado[],
  });


  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [productoFiltrado, setProductoFiltrado] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [pago, setPago] = useState<number>(0);
  const [pagoString, setPagoString] = useState<string>("0");
  const [vuelto, setVuelto] = useState<number>(0);
  const { token } = useUser();

  if (!token) {
    window.location.href = "/login";
    return null; // Evitar renderizado adicional si no hay token
  }

  useEffect(() => {
    const fetchData = async () => {
      const productos = await fetchProductsStock(token || "");
      setProductos(productos);
      const clientes = await fetchClients(token || "");
      setClientes(clientes);
    };
    fetchData();
  }, []);

    // Recalcular vuelto cuando cambia pago o productos
  useEffect(() => {
    const total = calcularTotal();
    if (pago >= total) {
      setVuelto(pago - total);
    } else {
      setVuelto(0);
    }
  }, [pago, formData.productos]);


const handleVuelto = (input: string) => {
  // reemplazo de coma por punto para parsear
  const replacedPago = input.replace(/,/g, ".");
  const pagoNum = parseFloat(replacedPago);

  if (isNaN(pagoNum)) {
    setPago(0);
    setPagoString("");
    setVuelto(0);
    return;
  }

  setPago(pagoNum);
  setPagoString(input); // dejamos input sin formatear mientras escribe

  const total = calcularTotal();


  if (pagoNum >= total) {
    setVuelto(pagoNum - total);
  } else {
    setVuelto(0);
  }
};

const handlePagoBlur = () => {
  // cuando el usuario termine de editar, formateamos con separadores de miles
  setPagoString(formatCurrency(pago));
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
    handleVuelto(pagoString); // recalcular vuelto al quitar producto
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

    const result = await insertSalidaStock(token,dataToSend);


    if (result.status === "ok") {
      alert("Factura registrada correctamente");
      setFormData({
        tipo_origen: "facturacion",
        observaciones: "",
        id_cliente: 0,
        codigo_barra: "",
        cliente_nombre: "",
        metodo_pago: "efectivo",
        cliente_ruc: "",
        productos: [],
      });
      setPago(0);
      setPagoString("0");
      setVuelto(0);
      setBusqueda("");
      setProductoFiltrado(null);
      setCantidad(1);
      setBusquedaCliente("");
    } else {
      alert(result.message || "Error al registrar la factura");
    }
  };

  const productosSugeridos = productos.filter((p) =>
    `${p.codigo_barra} ${p.nombre.toLowerCase()}`.includes(busqueda.toLowerCase())
  );

  const clientesSugeridos = clientes.filter((cli) =>
    `${cli.nombre} ${cli.apellido}`.toLowerCase().includes(busquedaCliente.toLowerCase())
  );



const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();

    if (bloqueado) return;

    setBloqueado(true);
    setTimeout(() => setBloqueado(false), 300); // evitar doble escaneo

    const productoEncontrado = productos.find(p => p.codigo_barra === formData.codigo_barra.trim());

    if (productoEncontrado) {
      setFormData((prev) => {
        const productosActualizados = [...prev.productos];
        const indexExistente = productosActualizados.findIndex(
          p => p.id_producto === productoEncontrado.id
        );

        const cantidadActual = cantidad;

        if (indexExistente !== -1) {
          const productoExistente = productosActualizados[indexExistente];
          productosActualizados[indexExistente] = {
            ...productoExistente,
            cantidad: productoExistente.cantidad + cantidadActual,
          };
        } else {
          productosActualizados.push({
            id_producto: productoEncontrado.id,
            cantidad: cantidadActual,
          });
        }

        return {
          ...prev,
          productos: productosActualizados,
          codigo_barra: "",
        };
      });

      setBusqueda("");
      setProductoFiltrado(null);
    } else {
      alert("Producto no encontrado");
    }
  }
};


  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-6xl mx-auto bg-white rounded shadow text-gray-500">
      <h2 className="text-xl font-bold mb-4 text-gray-500">Formulario de Facturación</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 ">Tipo Origen</label>
          <select
            value={formData.tipo_origen}
            onChange={(e) => setFormData({ ...formData, tipo_origen: e.target.value })}
            className="w-full border p-2 rounded">
            <option value="facturacion">Facturacion</option>
          </select>
        </div>

        <div className="mb-4">
            <label className="block mb-1">Método de Pago</label>
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

<div className="mb-6">
  <label className="block mb-1">Escanear Código de Barras</label>
  <input
    type="text"
    placeholder="Escaneá el producto"
    value={formData.codigo_barra}
    ref={codigoBarraRef}
    onChange={(e) => setFormData({ ...formData, codigo_barra: e.target.value })}
  onKeyDown={(e) => handleKeyDown(e)}


    className="w-full border p-2 rounded"
    autoFocus
  />
</div>


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
              <span>Precio unitario: {producto ? formatCurrency(Number(producto.precio_venta)) : ""}</span>
              <button onClick={() => quitarProducto(idx)} className="text-red-600 hover:underline">
                Quitar
              </button>
            </li>
          );
        })}
      </ul>


      <div className="mb-4 font-bold">Total: {formatCurrency(calcularTotal())}</div>
      <div className="mb-4 font-bold">IVA (10%): {formatCurrency(calcularIVA())}</div>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div>
          <label className="block mb-1 ">Pago</label>

         <input
            type="text"
            value={pagoString}
            onChange={(e) => handleVuelto(e.target.value)}
            onBlur={handlePagoBlur}
            className="w-30 border p-2 rounded"
          />

        </div>
         <div>
            <label className="block mb-1 ">Vuelto</label>
           <input
              type="text"
              value={formatCurrency(vuelto)}
              readOnly
             className="w-30 border-2 border-green-500 p-2 rounded"
            />
        </div>
        <div>
          <label className="block mb-1 text-gray-100 ">.</label>
         <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
         Generar Factura
      </button>
      </div>
     </div>


    </form>
  );
}

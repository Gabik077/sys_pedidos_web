// types.ts

export interface Vendedor {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    comision: number;
}
export interface EnvioPedido {
    id: number;
    ordenEnvio: number;
    pedido: Pedido;
    movil: MovilPedido;
}
export interface MovilPedido {
    id?: number;
    nombreMovil: string;
    nombreChofer: string;
    chapaMovil: string;
    telefonoChofer: string;
}

export interface EnvioHeader {
    id: number;
    fechaCreacion: string;
    estado: string;
    envioPedido: EnvioPedido[];
    kmCalculado: string;
    tiempoCalculado: string;
    inicioRutaLat?: number; // Latitud de origen
    inicioRutaLon?: number; // Longitud de origen
    finRutaLat?: number; // Latitud de destino
    finRutaLon?: number; // Longitud de destino
}
export interface ComboHeader {
    id: number;
    nombreCombo: string;
    descripcionCombo: string;
    detalles: ComboDetalle[];
}
export interface ComboDetalle {
    id: number;
    cantidad: number;
    producto: Producto;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    codigo: string;
    precio_venta: string;
    marca: string;
    codigo_barra?: string;
    id_categoria: number;
    comboHeader?: ComboHeader;
    is_combo?: boolean; // Indica si es un combo
}
export interface Venta {
    id: number;
    total_venta: string;
    metodo_pago: string;
    fecha_venta: string; // ISO string
    estado: string;
    tipo_venta: string;
    cliente: Cliente;
    iva: string;
    salida_stock_general: SalidaStockGeneral;
}
export interface Salida {
    id: number;
    cantidad: number;
    id_pedido: number | null;
    observaciones: string | null;
    fecha_salida: string; // ISO string
    producto: Producto;
}

export interface SalidaStockGeneral {
    id: number;
    tipo_origen: string;
    id_origen: number | null;
    fecha: string; // ISO string
    id_cliente: number;
    observaciones: string;
    salidas: Salida[];
}

export interface Detalle {
    id: number;
    idProducto: number;
    cantidad: number;
    precioUnitario: string;
    estado: string;
    producto: Producto;
}

export interface Cliente {
    id: number;
    nombre?: string;
    apellido: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    ruc: string;
    lat: number;
    lon: number;
    zona?: ZonaCliente;
}

export interface Pedido {
    id: number;
    fechaPedido: string;
    estado: string;
    total: string;
    clienteNombre: string;
    observaciones: string;
    responsable: string;
    cliente: Cliente;
    detalles: Detalle[];
    idVendedor?: number;
    vendedorNombre?: string;
    tipoPedido?: TipoPedido;
}

export interface Ciudad {
    id: number;
    nombre: string;
}

export interface TipoVenta {
    id: number;
    nombre: string;
}

export interface ZonaCliente {
    id: number;
    nombre: string;
}

export interface TipoPedido {
    id: number;
    nombre: string;
}
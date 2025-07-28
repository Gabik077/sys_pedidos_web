// types.ts

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
    precio_venta: string;
    marca: string;
    id_categoria: number;
    comboHeader?: ComboHeader;
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
    nombre: string;
    apellido: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    ruc: string;
    lat: number;
    lon: number;
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
}

// types.ts

export interface EnvioPedido {
    id: number;
    ordenEnvio: number;
    pedido: Pedido;
    movil: {
        nombreMovil: string;
        nombreChofer: string;
        chapaMovil: string;
        telefonoChofer: string;
    };
}

export interface EnvioHeader {
    id: number;
    fechaCreacion: string;
    estado: string;
    envioPedido: EnvioPedido[];
    kmCalculado: string;
    tiempoCalculado: string;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio_venta: string;
    marca: string;
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

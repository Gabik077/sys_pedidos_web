import { handleRequest } from "./ApiHelper";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("La variable NEXT_PUBLIC_API_URL no está definida en el .env");
}


export const fetchPedidosPorVendedor = async (token: string, fechaInicio: string, fechaFin: string) => {
    return await handleRequest(`${apiUrl}/vendedor/pedidos-por-vendedor?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export const getEnvioById = async (token: string, envioId: number, estado: string) => {
    return await handleRequest(`${apiUrl}/stock/getEnvioById?estadoEnvio=${estado}&envioId=${envioId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getEnvios = async (token: string, estado: String) => {
    return await handleRequest(`${apiUrl}/stock/getEnvios?estadoEnvio=${estado}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getCombos = async (token: string, idProducto: number) => {
    return await handleRequest(`${apiUrl}/stock/combo/${idProducto}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const fetchMoviles = async (token: string) => {
    return await handleRequest(`${apiUrl}/stock/moviles`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export const deleteMovil = async (token: string, id: any) => {
    return await handleRequest(`${apiUrl}/stock/movil/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const fetchPedidoPorId = async (token: string, id: number) => {
    return await handleRequest(`${apiUrl}/stock/getPedido/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const guardarEstadoPedido = async (token: string, id_envio: number, estado: string) => {
    return await handleRequest(`${apiUrl}/stock/guardarEstadoPedido`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_envio, estado }),
    });
}

export const guardaEstadoPedido = async (data: any) => {
    return await handleRequest(`${apiUrl}/stock/guardarEstadoPedido`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function insertEnvioPedidos(token: string, data: any) {
    return await handleRequest(`${apiUrl}/stock/envio`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
}

export const finalizarPedidoSalon = async (token: string, data: any) => {
    return await handleRequest(`${apiUrl}/stock/finalizar-pedido-salon`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
};

export const updateEstadoPedido = async (token: string, idPedido: number, estado: string) => {
    return await handleRequest(`${apiUrl}/stock/updateEstadoPedido/${idPedido}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado }),
    });
};

export const getPedidos = async (token: string, estado: string) => {
    return await handleRequest(`${apiUrl}/stock/getPedidos?estadoPedido=${estado}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const fetchTipoPedido = async (token: string) => {
    return await handleRequest(`${apiUrl}/stock/tipo-pedido`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export async function updateEnvio(token: string, id: any, data: any) {
    return await handleRequest(`${apiUrl}/stock/editarEnvio/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
}

export async function insertPedido(token: string, data: any) {
    return await handleRequest(`${apiUrl}/stock/pedido`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
}
export async function updatePedido(token: string, id: any, data: any) {
    return await handleRequest(`${apiUrl}/stock/updatePedido/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
}

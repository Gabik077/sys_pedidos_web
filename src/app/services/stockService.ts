import { MovilPedido } from "../types";
import { handleRequest } from "./ApiHelper";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("La variable NEXT_PUBLIC_API_URL no está definida en el .env");
}

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

export const fetchProductsStock = async (token: string) => {
    return await handleRequest(`${apiUrl}/products`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
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

export const fetchStockList = async (token: string) => {
    return await handleRequest(`${apiUrl}/stock`, {
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

export async function insertEntradaStock(token: string, data: any) {
    return await handleRequest(`${apiUrl}/stock/entrada`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
}
export async function insertSalidaStock(token: string, data: any) {
    return await handleRequest(`${apiUrl}/stock/salida`, {
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

export async function updateStockItem(id: number, data: { cantidad_disponible: number }) {
    const res = await handleRequest(`/api/stock/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al actualizar el stock");

    return res.json();
}



export const fetchProductById = async (id: any) => {
    return await handleRequest(`${apiUrl}/products/${id}`);
};

export const createProduct = async (productData: any) => {
    return await handleRequest(`${apiUrl}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
    });
};

export const updateProductById = async (id: any, productData: any) => {
    return await handleRequest(`${apiUrl}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
    });
};


export const deleteProduct = async (id: number) => {
    return await handleRequest(`${apiUrl}/products/${id}`, {
        method: "DELETE",
    });
};


export const createMovil = async (token: string, movilData: MovilPedido) => {
    return await handleRequest(`${apiUrl}/stock/createMovil`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(movilData),
    });
};
export const updateMovilById = async (token: string, id: any, movilData: MovilPedido) => {
    return await handleRequest(`${apiUrl}/stock/editMovil/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(movilData),
    });
};
export const getMovilById = async (token: string, id: string) => {
    return await handleRequest(`${apiUrl}/stock/movil/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const deleteMovil = async (token: string, id: any) => {
    return await handleRequest(`${apiUrl}/stock/movil/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
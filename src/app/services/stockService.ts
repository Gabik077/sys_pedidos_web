import { handleRequest } from "./ApiHelper";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("La variable NEXT_PUBLIC_API_URL no está definida en el .env");
}

export const getEnvios = async (estado: String) => {
    return await handleRequest(`${apiUrl}/stock/getEnvios?estadoEnvio=${estado}`);
};

export const fetchMoviles = async () => {
    return await handleRequest(`${apiUrl}/stock/moviles`);
}

export const fetchProductsStock = async () => {
    return await handleRequest(`${apiUrl}/products`);
};

export const getPedidos = async (estado: string) => {
    return await handleRequest(`${apiUrl}/stock/getPedidos?estadoPedido=${estado}`);
};

export const fetchStockList = async () => {
    return await handleRequest(`${apiUrl}/stock`);
};

export const guardarEstadoPedido = async (id_envio: number, estado: string) => {
    return await handleRequest(`${apiUrl}/stock/guardarEstadoPedido`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
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

export async function insertEnvioPedidos(data: any) {
    return await handleRequest(`${apiUrl}/stock/envio`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function insertEntradaStock(data: any) {
    return await handleRequest(`${apiUrl}/stock/entrada`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}
export async function insertSalidaStock(data: any) {
    return await handleRequest(`${apiUrl}/stock/salida`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function insertPedido(data: any) {
    return await handleRequest(`${apiUrl}/stock/pedido`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
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
export const deleteMovil = async (id: number) => {
    return await handleRequest(`${apiUrl}/stock/moviles/${id}`, {
        method: "DELETE",
    });
};
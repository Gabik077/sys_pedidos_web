import { handleRequest } from "./ApiHelper";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("La variable NEXT_PUBLIC_API_URL no está definida en el .env");
}

export const fetchMoviles = async () => {
    return await handleRequest(`${apiUrl}/stock/moviles`);
}

export const fetchProductsStock = async () => {
    return await handleRequest(`${apiUrl}/products`);
};

export const getPedidos = async () => {
    return await handleRequest(`${apiUrl}/stock/getPedidosPendientes`);
};

export const fetchClients = async () => {
    return await handleRequest(`${apiUrl}/stock/clientes`);
};

export const fetchStockList = async () => {
    return await handleRequest(`${apiUrl}/stock`);
};

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

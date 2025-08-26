import { MovilPedido } from "../types";
import { handleRequest } from "./ApiHelper";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("La variable NEXT_PUBLIC_API_URL no está definida en el .env");
}

export const fetchVentas = async (token: string, fechaInicio: string, fechaFin: string) => {
    return await handleRequest(`${apiUrl}/stock/ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const fetchVentasDelivery = async (token: string, fechaInicio: string, fechaFin: string) => {
    return await handleRequest(`${apiUrl}/stock/ventas-pedidos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getTipoVenta = async (token: string) => {
    return await handleRequest(`${apiUrl}/stock/tipo-venta`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};



export const fetchProductsStock = async (token: string) => {
    return await handleRequest(`${apiUrl}/products`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};


export const fetchStockList = async (token: string) => {
    return await handleRequest(`${apiUrl}/stock`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};


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

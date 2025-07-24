import { handleRequest } from "./ApiHelper";

// app/services/productService.ts
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("La variable NEXT_PUBLIC_API_URL no está definida en el .env");
}



export const fetchProveedores = async (token: string) => {
    return await handleRequest(`${apiUrl}/products/proveedores`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

export const fetchUnidades = async (token: string) => {
    return await handleRequest(`${apiUrl}/products/unidades`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};


export const fetchProducts = async (token: string) => {
    return await handleRequest(`${apiUrl}/products`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

export const fetchProductById = async (token: string, id: any) => {
    return await handleRequest(`${apiUrl}/products/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

export const createProduct = async (token: string, productData: any) => {
    return await handleRequest(`${apiUrl}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
    });
};

export const updateProductById = async (token: string, id: any, productData: any) => {
    return await handleRequest(`${apiUrl}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
    });
};


export const deleteProduct = async (id: number) => {
    return await handleRequest(`${apiUrl}/products/${id}`, {
        method: "DELETE",
    });
};

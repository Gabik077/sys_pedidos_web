import { handleRequest } from "./ApiHelper";

// app/services/productService.ts
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("La variable NEXT_PUBLIC_API_URL no está definida en el .env");
}






export const fetchStock = async (token: string) => {
    return await handleRequest(`${apiUrl}/stock`,
        {
            headers: {
                Cookie: `token=${token}`
            },
            cache: 'no-store'
        }
    );
};

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

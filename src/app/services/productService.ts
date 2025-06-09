
// app/services/productService.ts
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("La variable NEXT_PUBLIC_API_URL no está definida en el .env");
}

const handleRequest = async (url: string, options: RequestInit = {}) => {
    try {
        const res = await fetch(url, {
            credentials: options.credentials ?? 'include',
            ...options,
        });

        if (!res.ok) {
            throw new Error(`Error en la API: ${res.status} - ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Error en la petición:", error);
        throw error;
    }
};

export const fetchProducts = async () => {
    return await handleRequest(`${apiUrl}/products`);
};

export const fetchProductById = async (id: number) => {
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

export const updateProductById = async (id: number, productData: any) => {
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

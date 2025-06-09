
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
        console.log("res  petición:", res);
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                // Redirige si está no autorizado o prohibido
                return { status: res.status, message: "No autorizado o prohibido" };
            }

            throw new Error(`Error en la API: ${res.status} - ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Error en la petición:", error);
        throw error;
    }
};

export const fetchProducts = async (token: string) => {
    return await handleRequest(`${apiUrl}/products`,
        {
            headers: {
                Cookie: `token=${token}`
            },
            cache: 'no-store'
        }
    );
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

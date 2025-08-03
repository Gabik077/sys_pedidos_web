// Función genérica para manejar errores en las llamadas a la API


export const handleRequestGET = async (url: string) => {
    try {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include", // ✅ Esto incluye cookies (como el token JWT)
        });

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                // Redirige si no está autorizado o prohibido
                return { status: res.status, message: res.statusText };
            }
            if (res.status === 400) {
                return { status: res.status, message: res.statusText };
            }

            if (res.status === 500) {
                return { status: res.status, message: res.statusText };
            }

            throw new Error(`Error en la API: ${res.status} - ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Error en la petición:", error);
        throw error;
    }
};


export const handleRequest = async (url: string, options: RequestInit = {}) => {
    try {
        const res = await fetch(url, {
            credentials: options.credentials ?? 'include',
            ...options,
        });
        console.log(" petición url:", url, "status:", res.status);
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                // Redirige si no está autorizado o prohibido
                return { status: res.status, message: res.statusText };
            }
            if (res.status === 400) {
                return { status: res.status, message: res.statusText };
            }

            if (res.status === 500) {
                return { status: res.status, message: res.statusText };
            }

            return { status: res.status, message: res.statusText };
        }

        return await res.json();
    } catch (error) {
        console.error("Error en la petición:", error);
        throw error;
    }
};

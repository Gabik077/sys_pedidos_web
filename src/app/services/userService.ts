
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("La variable NEXT_PUBLIC_API_URL no está definida en el .env");
}

// Obtener todos los usuarios
export const fetchUsers = async (token: string) => {
    return await handleRequest(`${apiUrl}/users`, {
        headers: {
            Cookie: `token=${token}`
        },
        cache: 'no-store'
    });
};

export const fetchUserById = async (id: any) => {
    return await handleRequest(`${apiUrl}/users/${id}`);
};

export const fetchRoles = async () => {
    return await handleRequest(`${apiUrl}/users/roles`);
}

// Crear usuario
export const createUser = async (userData: any) => {
    console.log("userData", JSON.stringify(userData));
    return await handleRequest(`${apiUrl}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
};

// Actualizar usuario
export const updateUserById = async (id: any, userData: any) => {

    return await handleRequest(`${apiUrl}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
};

// Eliminar usuario
export const deleteUser = async (id: number) => {
    return await handleRequest(`${apiUrl}/users/${id}`, {
        method: "DELETE",
    });
};


// Función genérica para manejar errores en las llamadas a la API
const handleRequest = async (url: string, options: RequestInit = {}) => {
    try {
        const res = await fetch(url, {
            credentials: options.credentials ?? 'include',
            ...options,
        });
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {

                return {
                    status: res.status, message: "No autorizado o prohibido"
                }
                throw new Error(`Error en la API: ${res.status} - ${res.statusText}`);
            }
        }
        return await res.json();
    } catch (error) {
        console.error("Error en la petición:", error);
        throw error;
    }
};

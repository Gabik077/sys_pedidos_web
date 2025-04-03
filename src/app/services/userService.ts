const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("La variable NEXT_PUBLIC_API_URL no está definida en el .env");
}

// Obtener todos los usuarios
export const fetchUsers = async () => {
    return await handleRequest(`${apiUrl}/users`);
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
export const updateUser = async (id: number, userData: any) => {
    return await handleRequest(`${apiUrl}/users/${id}`, {
        method: "PATCH",
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
const handleRequest = async (url: string, options?: RequestInit) => {
    try {
        const res = await fetch(url, options);

        if (!res.ok) {
            throw new Error(`Error en la API: ${res.status} - ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Error en la petición:", error);
        throw error;
    }
};
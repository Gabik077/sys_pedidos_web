import { handleRequest } from "./ApiHelper";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("La variable NEXT_PUBLIC_API_URL no está definida en el .env");
}

// Obtener todos los usuarios
export const fetchUsers = async (token: string) => {
    return await handleRequest(`${apiUrl}/users`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
        cache: 'no-store'
    });
};

export const fetchUserById = async (token: string, id: any) => {
    return await handleRequest(`${apiUrl}/users/${id}`, {
        headers: {
            authorization: `Bearer ${token}`,
        }
    });
};

export const fetchRoles = async (token: string) => {
    return await handleRequest(`${apiUrl}/users/roles`, {
        headers: {
            authorization: `Bearer ${token}`,
        }
    });
}

// Crear usuario
export const createUser = async (token: string, userData: any) => {
    console.log("userData", JSON.stringify(userData));
    return await handleRequest(`${apiUrl}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userData),
    });
};

// Actualizar usuario
export const updateUserById = async (token: string, id: any, userData: any) => {

    return await handleRequest(`${apiUrl}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userData),
    });
};

// Eliminar usuario
export const deleteUser = async (token: string, id: number) => {
    return await handleRequest(`${apiUrl}/users/${id}`, {
        headers: {
            authorization: `Bearer ${token}`
        },
        method: "DELETE",
    });
};

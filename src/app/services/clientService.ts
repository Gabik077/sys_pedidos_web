import { handleRequest } from "./ApiHelper";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("La variable NEXT_PUBLIC_API_URL no está definida en el .env");
}

export const fetchClientsFromServer = async (token: String) => {
    return await handleRequest(`${apiUrl}/clients`, {
        headers: {
            Cookie: `token=${token}`
        },
        cache: 'no-store'
    });
};
export const createCliente = async (token: string, clienteData: any) => {
    return await handleRequest(`${apiUrl}/clients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(clienteData),
    });
};

export const fetchClienteById = async (token: string, id: String) => {
    return await handleRequest(`${apiUrl}/clients/${id}`, {
        headers: {
            authorization: `Bearer ${token}`
        }
    });
};

export const updateCliente = async (token: string, id: String, clienteData: any) => {
    return await handleRequest(`${apiUrl}/clients/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(clienteData),
    });
};

export const deleteCliente = async (token: string, id: number) => {
    return await handleRequest(`${apiUrl}/clients/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const fetchClients = async (token: string) => {
    return await handleRequest(`${apiUrl}/clients`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

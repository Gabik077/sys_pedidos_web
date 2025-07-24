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
export const createCliente = async (clienteData: any) => {
    return await handleRequest(`${apiUrl}/clients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteData),
    });
};

export const fetchClienteById = async (id: String) => {
    return await handleRequest(`${apiUrl}/clients/${id}`)
};

export const updateCliente = async (id: String, clienteData: any) => {
    return await handleRequest(`${apiUrl}/clients/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteData),
    });
};

export const deleteCliente = async (id: number) => {
    return await handleRequest(`${apiUrl}/clients/${id}`, {
        method: "DELETE",
    });
};

export const fetchClients = async (token: string) => {
    return await handleRequest(`${apiUrl}/clients`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

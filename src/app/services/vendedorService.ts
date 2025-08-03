import { Vendedor } from "../types";
import { handleRequest } from "./ApiHelper";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("La variable NEXT_PUBLIC_API_URL no está definida en el .env");
}

export async function fetchVendedorById(token: string, id: any) {
    return await handleRequest(`${apiUrl}/vendedor/${id}`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
        cache: 'no-store'
    });
};

export async function updateVendedor(token: string, id: any, vendedorData: any) {
    return await handleRequest(`${apiUrl}/vendedor/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vendedorData),
        cache: 'no-store'
    });
};

export async function fetchVendedores(token: string) {
    return await handleRequest(`${process.env.NEXT_PUBLIC_API_URL}/vendedor`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
        cache: 'no-store'
    });
};

export async function createVendedor(token: string, vendedorData: any) {
    return await handleRequest(`${process.env.NEXT_PUBLIC_API_URL}/vendedor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vendedorData),
        cache: 'no-store'
    });
};

export async function deleteVendedor(token: string, id: number) {
    return await handleRequest(`${process.env.NEXT_PUBLIC_API_URL}/vendedor/${id}`, {
        method: 'DELETE',
        headers: {
            authorization: `Bearer ${token}`,
        },
        cache: 'no-store'
    });
};

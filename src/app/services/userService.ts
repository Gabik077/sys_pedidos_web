// Funciones para hacer CRUD de usuarios con la API
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchUsers = async () => {
    const res = await fetch(`${apiUrl}/users`);
    const data = await res.json();
    return data;
};

export const createUser = async (userData: any) => {
    const res = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return res.json();
};

export const updateUser = async (id: number, userData: any) => {
    const res = await fetch(`${apiUrl}/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return res.json();
};

export const deleteUser = async (id: number) => {
    const res = await fetch(`${apiUrl}/users/${id}`, {
        method: 'DELETE',
    });
    return res.json();
};

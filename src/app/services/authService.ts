// src/services/authService.ts

interface LoginResponse {
    status: string;
    message?: string;
    data?: any;
}

// Usamos la variable de entorno para obtener la URL de la API
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            const data = await res.json();
            if (data.status === 'ok') {
                return { status: 'ok', data };
            } else {
                return { status: 'error', message: data.message || 'Error de autenticación' };
            }
        } else {
            const errorData = await res.json();
            return { status: 'error', message: errorData.message || 'Error en la comunicación con el servidor' };
        }
    } catch (error) {
        return { status: 'error', message: 'Error de red o servidor' };
    }
};

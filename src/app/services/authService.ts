// src/services/authService.ts

interface LoginResponse {
    status: string;
    message?: string;
    data?: any;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const res = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
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

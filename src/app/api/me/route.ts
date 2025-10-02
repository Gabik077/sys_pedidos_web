import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { login } from '@/app/services/authService';

export async function GET() {
    const cookieStore = await cookies();
    const token = (await cookieStore).get('token')?.value;
    if (!token) {
        return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return NextResponse.json({ status: 'ok', user: decoded, token: token });
    } catch (err) {
        return NextResponse.json({ status: 'invalid_token' }, { status: 401 });
    }
}



export async function POST(req: Request) {
    const { username, password } = await req.json();

    // Reemplazá esto con tu función real de login:
    const res = await login(username, password);

    if (res.status !== "ok") {
        return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    const token = res.token;
    if (!token || typeof token !== "string") {
        return NextResponse.json({ status: "error", message: "Token inválido" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET!);
        if (
            typeof decoded === 'object' &&
            decoded !== null &&
            'role' in decoded &&
            typeof (decoded as any).role === 'string' &&//roles validos
            (decoded as any).role !== 'ADMINISTRADOR' &&
            (decoded as any).role !== 'SYSADMIN' &&
            (decoded as any).role !== 'VENDEDOR' &&
            (decoded as any).role !== 'COMPRADOR'
        ) {
            return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
        }

    } catch (err) {
        return NextResponse.json({ status: 'invalid_token' }, { status: 401 });
    }

    // Guardamos el token en una cookie segura, HTTP-only
    (await cookies()).set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 1, // 1 día
        path: "/",
        sameSite: "lax",
    });

    return NextResponse.json({ status: "ok" });
}

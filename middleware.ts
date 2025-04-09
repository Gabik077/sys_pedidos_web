import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_PATHS = ['/', '/login', '/api/auth'];

export function middleware(req: NextRequest) {
    alert("as");
    const { pathname } = req.nextUrl;

    // Dejar pasar si es una ruta pública
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    const token = req.cookies.get('token')?.value;



    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

        // Ruta protegida solo para admins
        if (pathname.startsWith('/users') && decoded.role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }


        return NextResponse.next();
    } catch (err) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

// Define qué rutas serán manejadas por el middleware
export const config = {
    matcher: ['/users/:path*'],
};

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    const token = (await cookieStore).get('token')?.value;

    if (!token) {
        return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return NextResponse.json({ status: 'ok', user: decoded });
    } catch (err) {
        return NextResponse.json({ status: 'invalid_token' }, { status: 401 });
    }
}

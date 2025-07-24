import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = cookies();
    (await cookieStore).set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0), // fuerza expiración inmediata
        path: "/",
        sameSite: "lax",
    });

    return NextResponse.json({ status: "ok" });
}

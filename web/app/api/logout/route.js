import { NextResponse } from 'next/server';
import { proxy } from "../_proxy";

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const res = await proxy(
      request,
      `${process.env.API_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'appToken': process.env.APP_TOKEN,
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );
    const data = await res.json();

    console.log("Logout response:", data);

    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json(
        { success: false, message: data.message || "Erro ao realizar logout" },
        { status: res.status }
      );
    }
    

    const response = NextResponse.json({ success: true, message: data.message || "Logout realizado com sucesso" });

    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0), // expira o cookie imediatamente
      path: '/',
    });

    return response;
  } catch (err) {
    console.error("Erro no logout:", err);
    return NextResponse.json(
      { success: false, message: "Erro ao conectar ao servidor" },
      { status: 500 }
    );
  }
}
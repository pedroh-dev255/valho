//api/configs/users/invite/route.js
import { NextResponse } from "next/server";
import { proxy } from "../../../_proxy";

export async function POST(request) {
    try {
        const token = request.cookies.get('token')?.value;
        const email = await request.json();
        const res = await proxy(request, `${process.env.API_URL}/api/config/users/invite`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(email),
                cache: 'no-store',
            }
        );
        if(res.status === 403) {
            return NextResponse.json({ success: false, message: 'Acesso negado' }, { status: 403 });
        }
        
        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ success: false, message: 'Erro ao carregar dados' }, { status: 500 });
    }
}
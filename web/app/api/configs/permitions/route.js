//api/configs/permitions/route.js
import { NextResponse } from "next/server";
import { proxy } from "../../_proxy";

export async function GET(request) {
    try {
        const token = request.cookies.get('token')?.value;

        const response = await proxy(request, `${process.env.API_URL}/api/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store',
        });

        if(response.status === 403) {
            return NextResponse.json({ success: false, message: 'Acesso negado' }, { status: 403 });
        }

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ success: false, message: data.message || 'Erro ao carregar permissões' }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ success: false, message: 'Erro ao carregar dados' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const token = request.cookies.get('token')?.value;

        const body = await request.json();

        const response = await proxy(request, `${process.env.API_URL}/api/roles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body),
        });

        if(response.status === 403) {
            return NextResponse.json({ success: false, message: 'Acesso negado' }, { status: 403 });
        }

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ success: false, message: data.message || 'Erro ao criar permissão' }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating permission:', error);
        return NextResponse.json({ success: false, message: 'Erro ao criar permissão' }, { status: 500 });
    }
}
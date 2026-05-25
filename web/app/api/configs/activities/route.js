//api/configs/activities/route.js
import { NextResponse } from "next/server";
import { proxy } from "../../_proxy";

export async function GET(request) {
    try {
        const token = request.cookies.get('token')?.value;
        const page = request.nextUrl.searchParams.get('page');
        const search = request.nextUrl.searchParams.get('search');

        const response = await proxy(request, `${process.env.API_URL}/api/config/activities?page=${page}&search=${encodeURIComponent(search)}`, {
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
            return NextResponse.json({ success: false, message: data.message || 'Erro ao carregar atividades' }, { status: response.status });
        }

        return NextResponse.json({ success: true, data: data });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ success: false, message: 'Erro ao carregar dados' }, { status: 500 });
    }
}
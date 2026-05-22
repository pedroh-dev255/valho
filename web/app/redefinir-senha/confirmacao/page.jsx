'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import toast from 'react-hot-toast';


export default function ResetPassPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarSenha2, setMostrarSenha2] = useState(false);
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    
    useEffect(() => {
        const t = searchParams.get("token");

        if (!t) {
            toast.error('Token de redefinição não encontrado!')
            router.push("/login");
            return;
        }

        setToken(t);
    }, [searchParams, router]);

    function validaPassword(password) {
        if (password.length < 8) {
            return false
        }
        if (!/\d/.test(password)) {
            return false
        }
        if (!/[A-Z]/.test(password)) {
            return false
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return false
        }
        return true;
    }


    async function handleSubmit(event) {
        event.preventDefault();
        
        if(password !== password2){
            return toast.error("Senhas não conferem!")
        }

        if (!validaPassword(password)) {
            return toast.error("A senha deve conter no mínimo 8 caracteres, incluindo pelo menos um número, uma letra maiúscula e um caractere especial.")
        }
        
        try {

            const res = await fetch('/api/resetpass/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    token,
                    password
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao salvar nova senha');
            
            router.push('/login');
            return toast.success('Senha redefinida com sucesso!');
        } catch (error) {
            return toast.error(error.message);
        }

    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
                <h1 className="text-2xl font-semibold text-center mb-6" style={{color: "#229c0a"}}>Valho!</h1>
                <h2 className='text-2x2 font-semibold text-center mb-6'>Confirmação de Redefinição de Senha</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Senha</label>
                        <input
                            type={mostrarSenha ? 'text' : 'password'}
                            minLength={6}
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                        >
                            {mostrarSenha ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </button>
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Confirme a Nova Senha</label>
                        <input
                            type={mostrarSenha2 ? 'text' : 'password'}
                            minLength={6}
                            required
                            value={password2}
                            onChange={e => setPassword2(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha2(!mostrarSenha2)}
                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                        >
                            {mostrarSenha2 ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Redefinir Senha
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    <a href="/login" className="text-blue-600 hover:underline">
                        Voltar ao Login
                    </a>
                </p>
            </div>
        </div>
    );
}
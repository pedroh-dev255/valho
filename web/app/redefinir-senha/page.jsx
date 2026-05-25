'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
    Mail,
    ArrowLeft,
    Send
} from 'lucide-react';

import { motion } from 'framer-motion';

export default function ForgotPassPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setLoading(true);

        try {
            const res = await fetch('/api/resetpass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email
                })
            });

            const data = await res.json();

            if (res.status === 401) {
                throw new Error(
                    data.message || 'Email não encontrado'
                );
            }

            if (!res.ok) {
                throw new Error(
                    data.message ||
                    'Erro ao enviar token de redefinição'
                );
            }

            toast.success(
                'Token de redefinição enviado por email!'
            );

            router.push('/login');

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="
                min-h-screen
                bg-zinc-100 dark:bg-[#09090B]
                flex items-center justify-center
                p-4
                text-zinc-900 dark:text-white
            "
        >
            {/* BACKGROUND GLOW */}
            <div
                className="
                    absolute inset-0 overflow-hidden
                    pointer-events-none
                "
            >
                <div
                    className="
                        absolute top-[-150px] left-[-150px]
                        w-[400px] h-[400px]
                        bg-emerald-500/10
                        blur-3xl rounded-full
                    "
                />

                <div
                    className="
                        absolute bottom-[-150px] right-[-150px]
                        w-[400px] h-[400px]
                        bg-emerald-500/10
                        blur-3xl rounded-full
                    "
                />
            </div>

            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.98
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                }}
                transition={{
                    duration: 0.4
                }}
                className="
                    relative
                    w-full max-w-md
                    bg-white dark:bg-[#111113]
                    border border-zinc-200 dark:border-zinc-800
                    rounded-3xl
                    shadow-2xl
                    overflow-hidden
                "
            >
                {/* HEADER */}
                <div
                    className="
                        p-8
                        border-b border-zinc-200 dark:border-zinc-800
                    "
                >
                    <div
                        className="
                            w-14 h-14 rounded-2xl
                            bg-emerald-500/15
                            text-emerald-500
                            flex items-center justify-center
                            mb-5
                        "
                    >
                        <Mail size={26} />
                    </div>

                    <h1
                        className="
                            text-3xl font-bold
                            tracking-tight
                        "
                    >
                        Redefinir Senha
                    </h1>

                    <p
                        className="
                            text-zinc-500
                            mt-3
                            leading-relaxed
                        "
                    >
                        Informe seu email para receber o link de redefinição de senha.
                    </p>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="p-8 space-y-6"
                >
                    <div className="space-y-2">
                        <label
                            className="
                                text-sm
                                text-zinc-500
                            "
                        >
                            E-mail
                        </label>

                        <div
                            className="
                                h-14 rounded-2xl
                                border border-zinc-200 dark:border-zinc-800
                                bg-zinc-50 dark:bg-[#09090B]
                                px-4
                                flex items-center gap-3
                                transition-all
                                focus-within:border-emerald-500/50
                                focus-within:ring-4
                                focus-within:ring-emerald-500/10
                            "
                        >
                            <Mail
                                size={18}
                                className="text-zinc-500"
                            />

                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="usuario@empresa.com"
                                className="
                                    w-full
                                    bg-transparent
                                    outline-none
                                    text-sm
                                    text-zinc-900 dark:text-white
                                    placeholder:text-zinc-500
                                "
                            />
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="space-y-3">
                        <motion.button
                            whileHover={{
                                scale: 1.02
                            }}
                            whileTap={{
                                scale: 0.98
                            }}
                            type="submit"
                            disabled={loading}
                            className="
                                w-full h-14
                                rounded-2xl
                                bg-emerald-500
                                hover:bg-emerald-400
                                transition-all
                                text-black
                                font-semibold
                                flex items-center justify-center gap-2
                                disabled:opacity-50
                            "
                        >
                            <Send size={18} />

                            {loading
                                ? 'Enviando E-mail...'
                                : 'Enviar Link'}
                        </motion.button>

                        <button
                            type="button"
                            onClick={() =>
                                router.push('/login')
                            }
                            className="
                                w-full h-14
                                rounded-2xl
                                border border-zinc-200 dark:border-zinc-800
                                bg-zinc-50 dark:bg-[#09090B]
                                hover:bg-zinc-200
                                dark:hover:bg-zinc-800
                                transition-all
                                font-medium
                                flex items-center justify-center gap-2
                            "
                        >
                            <ArrowLeft size={18} />
                            Voltar ao Login
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
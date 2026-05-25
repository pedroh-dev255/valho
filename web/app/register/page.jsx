'use client';

import { useEffect, useMemo, useState } from 'react';

import {
    useSearchParams,
    useRouter
} from 'next/navigation';

import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    ArrowLeft
} from 'lucide-react';

import { motion } from 'framer-motion';

import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();

    const params = useSearchParams();
    const [erro, setErro] = useState('');

    const [inviteToken, setInviteToken] = useState('');

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarSenha2, setMostrarSenha2] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = params.get('invite');
        console.log(token);
        if (token) {
            setInviteToken(token);
        } else {
            toast.error('Convite inválido');
        }


    }, [params]);

    // PASSWORD RULES
    const passwordRules = useMemo(() => ({
        minLength: password.length >= 8,
        number: /\d/.test(password),
        uppercase: /[A-Z]/.test(password),
        special:
            /[!@#$%^&*(),.?":{}|<>]/.test(password),
        equal:
            password.length > 0 &&
            password === password2
    }), [password, password2]);

    function validaPassword() {
        return (
            passwordRules.minLength &&
            passwordRules.number &&
            passwordRules.uppercase &&
            passwordRules.special
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!nome.trim()) {
            return toast.error(
                'Informe seu nome'
            );
        }

        if (!email.trim()) {
            return toast.error(
                'Informe seu email'
            );
        }

        if (!validaPassword()) {
            return toast.error(
                'A senha não atende os requisitos'
            );
        }

        if (!passwordRules.equal) {
            return toast.error(
                'As senhas não conferem'
            );
        }

        setLoading(true);

        try {
            const res = await fetch(
                '/api/register',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        nome,
                        email,
                        password,
                        inviteToken
                    })
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message ||
                    'Erro ao criar conta'
                );
            }

            toast.success(
                'Conta criada com sucesso!'
            );

            router.push('/login');

        } catch (error) {
            toast.error(error.message);
            setErro(error.message);
        } finally {
            setLoading(false);
        }
    }

    function RuleItem({
        valid,
        text
    }) {
        return (
            <div
                className={`
                    flex items-center gap-2
                    transition-all

                    ${valid
                        ? 'text-emerald-500'
                        : 'text-zinc-500'
                    }
                `}
            >
                {valid ? (
                    <CheckCircle2 size={16} />
                ) : (
                    <XCircle size={16} />
                )}

                <span>{text}</span>
            </div>
        );
    }

    return (
        <div
            className="
                min-h-screen
                bg-zinc-100 dark:bg-[#09090B]
                flex items-center justify-center
                p-4
                text-zinc-900 dark:text-white
                relative overflow-hidden
            "
        >
            {/* GLOW */}
            <div
                className="
                    absolute inset-0
                    pointer-events-none
                    overflow-hidden
                "
            >
                <div
                    className="
                        absolute
                        top-[-200px]
                        left-[-150px]
                        w-[450px]
                        h-[450px]
                        rounded-full
                        bg-emerald-500/10
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        bottom-[-200px]
                        right-[-150px]
                        w-[450px]
                        h-[450px]
                        rounded-full
                        bg-emerald-500/10
                        blur-3xl
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
                    w-full max-w-xl
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
                        <ShieldCheck size={26} />
                    </div>

                    <h1
                        className="
                            text-3xl font-bold
                            tracking-tight
                        "
                    >
                        Criar Conta
                    </h1>

                    <p
                        className="
                            mt-3
                            text-zinc-500
                            leading-relaxed
                        "
                    >
                        Finalize seu cadastro para acessar
                        a plataforma Valho!.
                    </p>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="p-8 space-y-6"
                >
                    {/* NOME */}
                    <div className="space-y-2">
                        <label
                            className="
                                text-sm
                                text-zinc-500
                            "
                        >
                            Nome Completo
                        </label>

                        <div
                            className="
                                h-14
                                rounded-2xl
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
                            <User
                                size={18}
                                className="text-zinc-500"
                            />

                            <input
                                type="text"
                                required
                                value={nome}
                                onChange={(e) =>
                                    setNome(
                                        e.target.value
                                    )
                                }
                                placeholder="Seu nome"
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

                    {/* EMAIL */}
                    <div className="space-y-2">
                        <label
                            className="
                                text-sm
                                text-zinc-500
                            "
                        >
                            Email
                        </label>

                        <div
                            className="
                                h-14
                                rounded-2xl
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
                                    setEmail(
                                        e.target.value
                                    )
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

                    {/* PASSWORD */}
                    <div className="space-y-2">
                        <label
                            className="
                                text-sm
                                text-zinc-500
                            "
                        >
                            Senha
                        </label>

                        <div
                            className="
                                h-14
                                rounded-2xl
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
                            <Lock
                                size={18}
                                className="text-zinc-500"
                            />

                            <input
                                type={
                                    mostrarSenha
                                        ? 'text'
                                        : 'password'
                                }
                                required
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Digite sua senha"
                                className="
                                    w-full
                                    bg-transparent
                                    outline-none
                                    text-sm
                                    text-zinc-900 dark:text-white
                                    placeholder:text-zinc-500
                                "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setMostrarSenha(
                                        !mostrarSenha
                                    )
                                }
                                className="
                                    text-zinc-500
                                    hover:text-zinc-300
                                    transition-all
                                "
                            >
                                {mostrarSenha ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="space-y-2">
                        <label
                            className="
                                text-sm
                                text-zinc-500
                            "
                        >
                            Confirmar Senha
                        </label>

                        <div
                            className="
                                h-14
                                rounded-2xl
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
                            <Lock
                                size={18}
                                className="text-zinc-500"
                            />

                            <input
                                type={
                                    mostrarSenha2
                                        ? 'text'
                                        : 'password'
                                }
                                required
                                value={password2}
                                onChange={(e) =>
                                    setPassword2(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirme sua senha"
                                className="
                                    w-full
                                    bg-transparent
                                    outline-none
                                    text-sm
                                    text-zinc-900 dark:text-white
                                    placeholder:text-zinc-500
                                "
                            />
                            

                            <button
                                type="button"
                                onClick={() =>
                                    setMostrarSenha2(
                                        !mostrarSenha2
                                    )
                                }
                                className="
                                    text-zinc-500
                                    hover:text-zinc-300
                                    transition-all
                                "
                            >
                                {mostrarSenha2 ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* RULES */}
                    <div
                        className="
                            rounded-2xl
                            border border-zinc-200 dark:border-zinc-800
                            bg-zinc-50 dark:bg-[#09090B]
                            p-5
                            space-y-3
                            text-sm
                        "
                    >
                        <p
                            className="
                                font-medium
                                text-zinc-400
                            "
                        >
                            Sua senha deve conter:
                        </p>

                        <RuleItem
                            valid={
                                passwordRules.minLength
                            }
                            text="Mínimo de 8 caracteres"
                        />

                        <RuleItem
                            valid={
                                passwordRules.number
                            }
                            text="Pelo menos 1 número"
                        />

                        <RuleItem
                            valid={
                                passwordRules.uppercase
                            }
                            text="Pelo menos 1 letra maiúscula"
                        />

                        <RuleItem
                            valid={
                                passwordRules.special
                            }
                            text="Pelo menos 1 caractere especial"
                        />

                        <RuleItem
                            valid={
                                passwordRules.equal
                            }
                            text="As senhas devem ser iguais"
                        />
                    </div>

                    {/* ERROR MESSAGE */}
                    {erro && (
                        <p className="text-red-500 text-sm text-center">
                            {erro}
                        </p>
                    )}

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
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? 'Criando conta...'
                                : 'Criar Conta'}
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
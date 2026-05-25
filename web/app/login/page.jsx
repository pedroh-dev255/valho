'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  EyeIcon,
  EyeOffIcon,
  ShieldCheck,
  LockKeyhole,
  Mail
} from 'lucide-react';
import Link from "next/link";

import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setErro('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          email,
          senha
        }),

        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(
          data.message ||
          'Usuário ou senha inválidos'
        );

        setErro(
          data.message ||
          'Usuário ou senha inválidos'
        );

        setLoading(false);

        return;
      }

      toast.success(
        'Login realizado com sucesso!'
      );

      router.push('/');

    } catch (err) {
      console.error(err);

      setErro(
        'Erro ao conectar com o servidor'
      );

      setLoading(false);
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
        overflow-hidden
        relative
      "
    >
      {/* BG EFFECT */}
      <div
        className="
          absolute inset-0
          overflow-hidden
          pointer-events-none
        "
      >
        <div
          className="
            absolute top-[-120px] left-[-120px]
            w-96 h-96
            bg-emerald-500/10
            blur-3xl
            rounded-full
          "
        />

        <div
          className="
            absolute bottom-[-120px] right-[-120px]
            w-96 h-96
            bg-emerald-500/10
            blur-3xl
            rounded-full
          "
        />
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.96
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }}

        transition={{
          duration: 0.45
        }}

        className="
          relative z-10
          w-full max-w-md
        "
      >
        <div
          className="
            rounded-[2rem]
            border border-zinc-200 dark:border-zinc-800
            bg-white dark:bg-[#111113]
            shadow-2xl
            overflow-hidden
          "
        >
          {/* HEADER */}
          <div
            className="
              px-8 pt-10 pb-8
              border-b border-zinc-200 dark:border-zinc-800
            "
          >
            <div
              className="
                w-16 h-16
                rounded-3xl
                bg-emerald-500/15
                text-emerald-500
                flex items-center justify-center
                mx-auto mb-6
              "
            >
              <ShieldCheck size={30} />
            </div>

            <h1
              className="
                text-4xl
                font-black
                tracking-tight
                text-center
                text-emerald-500
              "
            >
              Valho
            </h1>

            <h2
              className="
                text-xl
                font-semibold
                text-center
                mt-4
                text-zinc-900 dark:text-white
              "
            >
              Acesso ao Sistema
            </h2>

            <p
              className="
                text-sm
                text-zinc-500
                text-center
                mt-2
                leading-relaxed
              "
            >
              Entre com suas credenciais para acessar o sistema.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-5"
          >
            {/* EMAIL */}
            <div className="space-y-2">
              <label
                className="
                  text-sm
                  font-medium
                  text-zinc-500
                "
              >
                E-mail
              </label>

              <div
                className="
                  h-14
                  rounded-2xl
                  border border-zinc-200 dark:border-zinc-800
                  bg-zinc-50 dark:bg-[#09090B]
                  flex items-center gap-3
                  px-4
                  transition-all
                  focus-within:border-emerald-500/50
                "
              >
                <Mail
                  size={18}
                  className="text-zinc-500"
                />

                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  placeholder="usuario@empresa.com"
                  className="
                    bg-zinc-50 dark:bg-[#09090B]
                    text-zinc-900 dark:text-white
                    placeholder:text-zinc-500
                    outline-none
                    w-full
                    text-sm
                    transition-all
                    focus:border-emerald-500/50
                    focus:ring-4 focus:ring-emerald-500/10
                  "
                />
              </div>
            </div>

            {/* SENHA */}
            <div className="space-y-2">
              <label
                className="
                  text-sm
                  font-medium
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
                  flex items-center gap-3
                  px-4
                  transition-all
                  focus-within:border-emerald-500/50
                "
              >
                <LockKeyhole
                  size={18}
                  className="text-zinc-500"
                />

                <input
                  type={
                    mostrarSenha
                      ? 'text'
                      : 'password'
                  }
                  name="senha"
                  minLength={6}
                  required

                  value={senha}

                  onChange={(e) =>
                    setSenha(e.target.value)
                  }

                  placeholder="Digite sua senha"

                  className="
                    bg-transparent
                    outline-none
                    w-full
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
                  {mostrarSenha
                    ? (
                      <EyeOffIcon size={18} />
                    )
                    : (
                      <EyeIcon size={18} />
                    )}
                </button>
              </div>
            </div>

            {/* ERRO */}
            {erro && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}

                className="
                  rounded-2xl
                  border border-red-500/20
                  bg-red-500/10
                  px-4 py-3
                  text-sm
                  text-red-500
                "
              >
                {erro}
              </motion.div>
            )}

            {/* BTN */}
            <motion.button
              whileHover={{
                scale: 1.01
              }}

              whileTap={{
                scale: 0.99
              }}

              type="submit"
              disabled={loading}

              className="
                w-full
                h-14
                rounded-2xl
                bg-emerald-500
                hover:bg-emerald-400
                transition-all
                text-black
                font-semibold
                disabled:opacity-50
                disabled:cursor-not-allowed
                mt-2
              "
            >
              {loading
                ? 'Entrando...'
                : 'Entrar'}
            </motion.button>
          </form>

          {/* FOOTER */}
          <div
            className="
              px-8 pb-8
              text-center
            "
          >
            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Esqueceu sua senha?{' '}

              <Link
                href="/redefinir-senha"
                className="
                  text-emerald-500
                  hover:text-emerald-400
                  transition-all
                  font-medium
                "
              >
                Redefinir acesso
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
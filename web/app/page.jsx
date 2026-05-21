"use client";

import Image from "next/image";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  async function handleLogout() {
    try {
      // Chama a rota API de logout
      await fetch('/api/logout', { method: 'POST' });
      router.replace('/login'); // Redireciona pro login
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo ao Valho!</h1>
      <p className="text-lg text-gray-600 mb-8">Gestão inteligente para seu negócio</p>
      <Image
        src="/icon-512-maskable.png"
        loading="eager"
        alt="Ilustração de gestão inteligente"
        width={300}
        height={300}
        className="rounded-lg shadow-lg"
      />
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}

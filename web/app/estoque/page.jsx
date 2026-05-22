"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import { AlertTriangle, Wallet } from "lucide-react";

import Sidebar from "../_components/Sidebar";


export default function Estoque() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);


    // tela de sem permissão
    if (!hasPermission) {
        return (
            <div className="min-h-screen bg-zinc-100 dark:bg-[#09090B] text-zinc-900 dark:text-white overflow-hidden">
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className="lg:ml-72 min-h-screen flex items-center justify-center">
                    <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center">
                        <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
                        <h2 className="text-2xl font-semibold mb-2">Acesso Negado</h2>
                        <p className="text-zinc-500">Você não tem permissão para acessar esta página.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-[#09090B] text-zinc-900 dark:text-white">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* MAIN */}
            <div className="lg:ml-72 min-h-screen flex flex-col">
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Estoque</h1>
                    <p>Em breve...</p>
                </div>
            </div>

        </div>
    );


}
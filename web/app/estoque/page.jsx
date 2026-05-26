"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import { AlertTriangle, Menu, Wallet } from "lucide-react";

import Sidebar from "../_components/Sidebar";


export default function Estoque() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hasPermission, setHasPermission] = useState(true);

    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    // tela de sem permissão
    if (!hasPermission) {
        return (
            <div className="min-h-screen bg-zinc-100 dark:bg-[#09090B] text-zinc-900 dark:text-white overflow-hidden">
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className="lg:ml-72 min-h-screen flex flex-col">
                    <header
                        className="
                            h-20
                            border-b border-zinc-200 dark:border-zinc-800
                            bg-zinc-100/80 dark:bg-[#09090B]/80
                            backdrop-blur-xl
                            flex items-center justify-between
                            px-4 lg:px-8
                            sticky top-0 z-30
                        "
                    >
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden"
                                onClick={() =>
                                    setSidebarOpen(true)
                                }
                            >
                                <Menu size={24} />
                            </button>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} >
                                <h2 className="text-2xl font-bold tracking-tight"> Estoque </h2>
                                <p className="text-sm text-zinc-500 mt-1"> Gerencie o estoque do sistema </p>
                            </motion.div>

                        </div>
                    </header>
                    <motion.main
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="
                            flex-1 p-4 lg:p-8
                            space-y-6
                        "
                    >
                        <div className="lg:ml-72 min-h-screen flex items-center justify-center">
                            <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center">
                                <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
                                <h2 className="text-2xl font-semibold mb-2">Acesso Negado</h2>
                                <p className="text-zinc-500">Você não tem permissão para acessar esta página.</p>
                            </div>
                        </div>
                    </motion.main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-[#09090B] text-zinc-900 dark:text-white overflow-hidden">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <div className="lg:ml-72 min-h-screen flex flex-col">
                <header
                    className="
                        h-20
                        border-b border-zinc-200 dark:border-zinc-800
                        bg-zinc-100/80 dark:bg-[#09090B]/80
                        backdrop-blur-xl
                        flex items-center justify-between
                        px-4 lg:px-8
                        sticky top-0 z-30
                    "
                >
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden"
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                        >
                            <Menu size={24} />
                        </button>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} >
                            <h2 className="text-2xl font-bold tracking-tight"> Estoque </h2>
                            <p className="text-sm text-zinc-500 mt-1"> Gerencie o estoque do sistema </p>
                        </motion.div>
                    </div>
                </header>
                <motion.main
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="
                        flex-1 p-4 lg:p-8
                        space-y-6
                    "
                >
                    <div className="lg:ml-72 min-h-screen flex items-center justify-center">
                        <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center">
                            <img src="jack-hammer-construction-worker-ezgif.com-gif-maker.gif" alt="Site em Construção" className="mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold mb-2">Site em Construção</h2>
                            <p className="text-zinc-500">Estamos trabalhando para trazer melhorias para você!</p>
                        </div>
                    </div>
                </motion.main>
            </div>
        </div>
    );


}
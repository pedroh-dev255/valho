'use client';

import { useEffect, useState } from 'react';
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Info,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Search,
    Menu
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Sidebar from '../../_components/Sidebar';

export default function Atividades() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    async function fetchActivities(currentPage = 1) {

        try {

            setLoading(true);

            const res = await fetch(
                `/api/configs/activities?page=${currentPage}&search=${encodeURIComponent(search)}`,
                {
                    method: 'GET',
                    headers: {
                        "Content-Type":"application/json"
                    },
                }
            );

            const data = await res.json();
            
            if(res.status === 403) {
                setHasPermission(false);
                toast.error('Acesso negado');
                return;
            }

            setHasPermission(true);

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message ||
                    'Erro ao carregar atividades'
                );
            }
            
            setActivities(
                data.data.activities.activities || []
            );
            setTotalPages(
                data.data.activities.totalPages || 1
            );
            setPage(
                data.data.activities.page || 1
            );
            toast.success(data.data.message || 'Atividades carregadas com sucesso' );
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchActivities(page);
    }, [page]);

    function handleSearch(e) {
        e.preventDefault();
        fetchActivities(1);
    }

    const levelStyles = {

        info: {
            icon: Info,
            dot: 'bg-blue-500',
            border:
                'border-blue-500/20',
            bg:
                'bg-blue-500/5',
            text:
                'text-blue-500'
        },

        good: {
            icon: CheckCircle2,
            dot: 'bg-emerald-500',
            border:
                'border-emerald-500/20',
            bg:
                'bg-emerald-500/5',
            text:
                'text-emerald-500'
        },

        warning: {
            icon: AlertTriangle,
            dot: 'bg-yellow-500',
            border:
                'border-yellow-500/20',
            bg:
                'bg-yellow-500/5',
            text:
                'text-yellow-500'
        },

        error: {
            icon: XCircle,
            dot: 'bg-red-500',
            border:
                'border-red-500/20',
            bg:
                'bg-red-500/5',
            text:
                'text-red-500'
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
                                <h2 className="text-2xl font-bold tracking-tight"> Atividades </h2>
                                <p className="text-sm text-zinc-500 mt-1"> Gerencie as atividades do sistema </p>
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
        <div
            className="
                min-h-screen
                bg-zinc-100 dark:bg-[#09090B]
                text-zinc-900 dark:text-white
            "
        >

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div
                className="
                    lg:ml-72
                    min-h-screen
                    flex flex-col
                "
            >

                {/* HEADER */}
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

                        <div>
                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                "
                            >
                                Atividades do Sistema
                            </h1>

                            <p
                                className="
                                    text-sm
                                    text-zinc-500
                                    mt-1
                                "
                            >
                                Histórico completo de eventos e ações
                            </p>
                        </div>
                    </div>

                    {/* SEARCH */}
                    <form
                        onSubmit={handleSearch}
                        className="
                            hidden md:flex
                            items-center gap-3
                            h-12
                            w-80
                            rounded-2xl
                            border border-zinc-200 dark:border-zinc-800
                            bg-white dark:bg-[#111113]
                            px-4
                        "
                    >

                        <Search
                            size={18}
                            className="text-zinc-500"
                        />

                        <input
                            type="text"
                            placeholder="Buscar atividade..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            className="
                                bg-transparent
                                outline-none
                                w-full
                                text-sm
                                placeholder:text-zinc-500
                            "
                        />
                    </form>
                </header>

                {/* CONTENT */}
                <main
                    className="
                        flex-1
                        p-4 lg:p-8
                    "
                >

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
                            bg-white dark:bg-[#111113]
                            border border-zinc-200 dark:border-zinc-800
                            rounded-3xl
                            overflow-hidden
                        "
                    >

                        {/* TITLE */}
                        <div
                            className="
                                px-6 py-5
                                border-b border-zinc-200 dark:border-zinc-800
                                flex items-center gap-3
                            "
                        >

                            <div
                                className="
                                    w-11 h-11
                                    rounded-2xl
                                    bg-emerald-500/10
                                    text-emerald-500
                                    flex items-center justify-center
                                "
                            >
                                <Activity size={22} />
                            </div>

                            <div>
                                <h2
                                    className="
                                        text-lg
                                        font-semibold
                                    "
                                >
                                    Logs do Sistema
                                </h2>

                                <p
                                    className="
                                        text-sm
                                        text-zinc-500
                                        mt-1
                                    "
                                >
                                    Todas as movimentações registradas
                                </p>
                            </div>
                        </div>

                        {/* LIST */}
                        <div className="p-6">

                            {loading ? (

                                <div className="space-y-4">

                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <div
                                            key={item}
                                            className="
                                                h-24
                                                rounded-2xl
                                                bg-zinc-100 dark:bg-zinc-900
                                                animate-pulse
                                            "
                                        />
                                    ))}

                                </div>

                            ) : activities.length === 0 ? (

                                <div
                                    className="
                                        h-72
                                        flex flex-col
                                        items-center justify-center
                                        text-center
                                    "
                                >

                                    <Activity
                                        size={42}
                                        className="
                                            text-zinc-500
                                            mb-4
                                        "
                                    />

                                    <h3
                                        className="
                                            text-lg
                                            font-semibold
                                        "
                                    >
                                        Nenhuma atividade encontrada
                                    </h3>

                                    <p
                                        className="
                                            text-zinc-500
                                            mt-2
                                        "
                                    >
                                        Não existem registros para exibir.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-4">

                                    {activities.map(
                                        (activity, index) => {

                                            const style =
                                                levelStyles[
                                                activity.level
                                                ] ||
                                                levelStyles.info;

                                            const Icon =
                                                style.icon;

                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0
                                                    }}
                                                    transition={{
                                                        delay:
                                                            index * 0.04
                                                    }}
                                                    className={`
                                                    rounded-2xl
                                                    border
                                                    p-5
                                                    transition-all

                                                    ${style.border}
                                                    ${style.bg}
                                                `}
                                                >

                                                    <div
                                                        className="
                                                        flex items-start gap-4
                                                    "
                                                    >

                                                        {/* ICON */}
                                                        <div
                                                            className={`
                                                            w-11 h-11
                                                            rounded-2xl
                                                            flex items-center justify-center
                                                            shrink-0

                                                            bg-zinc-100
                                                            dark:bg-[#09090B]

                                                            ${style.text}
                                                        `}
                                                        >
                                                            <Icon size={20} />
                                                        </div>

                                                        {/* CONTENT */}
                                                        <div className="flex-1">

                                                            <div
                                                                className="
                                                                flex items-center gap-2
                                                                mb-2
                                                            "
                                                            >

                                                                <div
                                                                    className={`
                                                                    w-2.5 h-2.5
                                                                    rounded-full
                                                                    ${style.dot}
                                                                `}
                                                                />

                                                                <span
                                                                    className="
                                                                    text-xs
                                                                    uppercase
                                                                    tracking-wider
                                                                    text-zinc-500
                                                                "
                                                                >
                                                                    {activity.level}
                                                                </span>
                                                            </div>

                                                            <p
                                                                className="
                                                                text-sm
                                                                leading-relaxed
                                                                text-zinc-700
                                                                dark:text-zinc-300
                                                            "
                                                            >
                                                                {activity.details}
                                                            </p>

                                                            <p
                                                                className="
                                                                text-xs
                                                                text-zinc-500
                                                                mt-3
                                                            "
                                                            >
                                                                {new Date(
                                                                    activity.created_at
                                                                ).toLocaleString(
                                                                    'pt-BR',
                                                                    {
                                                                        dateStyle: 'short',
                                                                        timeStyle: 'short'
                                                                    }
                                                                )}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </motion.div>
                                            );
                                        })}

                                </div>
                            )}

                            {/* PAGINATION */}
                            {!loading && totalPages > 1 && (
                                <div
                                    className="
                                        mt-8
                                        flex items-center justify-end gap-2
                                    "
                                >

                                    <button
                                        disabled={page <= 1}
                                        onClick={() =>
                                            setPage(
                                                (prev) =>
                                                    prev - 1
                                            )
                                        }
                                        className="
                                            w-11 h-11
                                            rounded-2xl
                                            border border-zinc-200 dark:border-zinc-800
                                            bg-zinc-50 dark:bg-[#09090B]
                                            hover:bg-zinc-200
                                            dark:hover:bg-zinc-800
                                            transition-all
                                            flex items-center justify-center
                                            disabled:opacity-40
                                        "
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    {Array.from({
                                        length: totalPages
                                    }).map((_, index) => {

                                        const pageNumber =
                                            index + 1;

                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() =>
                                                    setPage(
                                                        pageNumber
                                                    )
                                                }
                                                className={`
                                                    w-11 h-11
                                                    rounded-2xl
                                                    font-medium
                                                    transition-all

                                                    ${page === pageNumber
                                                        ? `
                                                                bg-emerald-500
                                                                text-black
                                                                font-semibold
                                                            `
                                                        : `
                                                                border border-zinc-200 dark:border-zinc-800
                                                                bg-zinc-50 dark:bg-[#09090B]
                                                                hover:bg-zinc-200
                                                                dark:hover:bg-zinc-800
                                                            `
                                                    }
                                                `}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}

                                    <button
                                        disabled={
                                            page >= totalPages
                                        }
                                        onClick={() =>
                                            setPage(
                                                (prev) =>
                                                    prev + 1
                                            )
                                        }
                                        className="
                                            w-11 h-11
                                            rounded-2xl
                                            border border-zinc-200 dark:border-zinc-800
                                            bg-zinc-50 dark:bg-[#09090B]
                                            hover:bg-zinc-200
                                            dark:hover:bg-zinc-800
                                            transition-all
                                            flex items-center justify-center
                                            disabled:opacity-40
                                        "
                                    >
                                        <ChevronRight size={18} />
                                    </button>

                                </div>
                            )}

                        </div>

                    </motion.div>

                </main>

            </div>

        </div>
    );
}
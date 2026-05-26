"use client";

import { useEffect, useState } from "react";

import {
    AlertTriangle,
    Menu,
    Search,
    Mail,
    UserPlus,
    Clock3,
    Send,
    X,
    CheckCircle2,
    ShieldCheck,
    MoreVertical,
    Copy,
    Trash2
} from "lucide-react";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Sidebar from "../../../_components/Sidebar";

export default function ConvitesPendentes() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hasPermission, setHasPermission] = useState(true);

    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);

    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);

    // MODAL
    function closeInviteModal() {
        setInviteModalOpen(false);
        setInviteEmail("");
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function toggleInviteMenu(inviteId) {
        setOpenMenuId((prev) =>
            prev === inviteId ? null : inviteId
        );
    }

    async function handleInviteUser() {
        if (!inviteEmail.trim()) {
            toast.error("Informe um email");
            return;
        }

        if (!validateEmail(inviteEmail)) {
            toast.error("Informe um email válido");
            return;
        }

        setInviteLoading(true);

        try {
            const res = await fetch(
                "/api/configs/users/invite",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        email: inviteEmail
                    })
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(
                    data.error ||
                    "Erro ao enviar convite"
                );

                return;
            }

            toast.success(
                "Convite enviado com sucesso!"
            );

            closeInviteModal();

            fetchData(new Event("refresh"));

        } catch (error) {
            console.error(error);

            toast.error(
                "Erro ao enviar convite"
            );
        } finally {
            setInviteLoading(false);
        }
    }

    async function fetchData(e) {
        e?.preventDefault();

        setLoading(true);

        try {
            const res = await fetch(
                "/api/configs/users/invite",
                {
                    method: "GET"
                }
            );

            if (res.status === 403) {
                setHasPermission(false);
                toast.error("Acesso negado");
                return;
            }

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(
                    data.message ||
                    "Erro ao carregar convites"
                );

                return;
            }

            setHasPermission(true);

            setInvites(data.invites || []);

        } catch (error) {
            console.error(error);

            toast.error(
                "Erro ao carregar convites"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData(new Event("fetch"));
    }, []);

    // ACTIONS
    async function handleCopyInvite(invite) {
        try {
            await navigator.clipboard.writeText(
                invite.token
            );

            toast.success(
                "Token copiado para área de transferência"
            );

            setOpenMenuId(null);

        } catch {
            toast.error("Erro ao copiar token");
        }
    }

    async function handleDeleteInvite(invite) {
        setOpenMenuId(null);

        try {
            const res = await fetch(
                `/api/configs/users/invite/?id=${invite.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(
                    data.message ||
                    "Erro ao cancelar convite"
                );
                return;
            }
            toast.success(data.message || "Convite cancelado");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao cancelar convite");
        } finally {
            fetchData(new Event("refresh"));
        }
    }

    // FILTER
    const filteredInvites = invites.filter((invite) =>
        invite.email
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // ANIMATIONS
    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const item = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(6px)"
        },

        show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",

            transition: {
                duration: 0.45
            }
        }
    };

    // LOADING
    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-100 dark:bg-[#09090B]">
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <div className="lg:ml-72 min-h-screen">
                    <div className="p-6 lg:p-8 space-y-6">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="
                                    h-28 rounded-3xl
                                    bg-white dark:bg-[#111113]
                                    border border-zinc-200 dark:border-zinc-800
                                    animate-pulse
                                "
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // SEM PERMISSÃO
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
                                <h2 className="text-2xl font-bold tracking-tight"> Convites </h2>
                                <p className="text-sm text-zinc-500 mt-1"> Gerencie os convites enviados </p>
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
        <div className="min-h-screen bg-zinc-100 dark:bg-[#09090B] text-zinc-900 dark:text-white">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="lg:ml-72 min-h-screen flex flex-col">
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

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                        >
                            <h2 className="text-2xl font-bold tracking-tight">
                                Convites
                            </h2>

                            <p className="text-sm text-zinc-500 mt-1">
                                Gerencie os convites enviados
                            </p>
                        </motion.div>
                    </div>

                    <motion.button
                        whileHover={{
                            scale: 1.03
                        }}
                        whileTap={{
                            scale: 0.97
                        }}
                        onClick={() =>
                            setInviteModalOpen(true)
                        }
                        className="
                            bg-emerald-500 text-black
                            h-12 px-5 rounded-2xl
                            font-semibold
                            flex items-center gap-2
                        "
                    >
                        <UserPlus size={18} />
                        Novo Convite
                    </motion.button>
                </header>

                {/* CONTENT */}
                <motion.main
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="
                        flex-1 p-4 lg:p-8
                        space-y-6
                    "
                >
                    {/* TABLE */}
                    <motion.section
                        variants={item}
                        className="
                            bg-white dark:bg-[#111113]
                            border border-zinc-200 dark:border-zinc-800
                            rounded-3xl
                            overflow-hidden
                        "
                    >
                        {/* TOP */}
                        <div
                            className="
                                p-6
                                border-b border-zinc-200 dark:border-zinc-800
                                flex flex-col lg:flex-row
                                gap-4
                                lg:items-center
                                lg:justify-between
                            "
                        >
                            <div>
                                <h3 className="text-xl font-semibold tracking-tight">
                                    Convites Enviados
                                </h3>

                                <p className="text-sm text-zinc-500 mt-1">
                                    Lista de convites enviados pelo sistema
                                </p>
                            </div>

                            <div
                                className="
                                    flex items-center gap-3
                                    bg-zinc-100 dark:bg-[#09090B]
                                    border border-zinc-200 dark:border-zinc-800
                                    rounded-2xl px-4
                                    h-12 w-full lg:w-80
                                "
                            >
                                <Search
                                    size={18}
                                    className="text-zinc-500"
                                />

                                <input
                                    type="text"
                                    placeholder="Buscar convite..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="
                                        bg-transparent outline-none w-full
                                        text-sm
                                        placeholder:text-zinc-500
                                    "
                                />
                            </div>
                        </div>

                        {/* LIST */}
                        <div className="p-4 space-y-3">
                            {filteredInvites.map(
                                (invite, index) => (
                                    <motion.div
                                        key={invite.id}
                                        initial={{
                                            opacity: 0,
                                            y: 15
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        transition={{
                                            delay:
                                                index *
                                                0.05
                                        }}
                                        className="
                                            p-5 rounded-2xl
                                            border border-zinc-200 dark:border-zinc-800
                                            bg-zinc-50 dark:bg-[#09090B]
                                            hover:border-emerald-500/30
                                            transition-all
                                        "
                                    >
                                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                                            {/* LEFT */}
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="
                                                        w-14 h-14 rounded-2xl
                                                        bg-zinc-200 dark:bg-zinc-800
                                                        flex items-center justify-center
                                                    "
                                                >
                                                    <Mail
                                                        size={
                                                            22
                                                        }
                                                        className="text-emerald-500"
                                                    />
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold text-lg tracking-tight">
                                                        {
                                                            invite.email
                                                        }
                                                    </h4>

                                                    <p className="text-sm text-zinc-500 mt-1">
                                                        ID do convite: #
                                                        {
                                                            invite.id
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* CENTER */}
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div
                                                    className="
                                                        text-sm text-zinc-500
                                                    "
                                                >
                                                    Enviado em:{" "}
                                                    {new Date(
                                                        invite.created_at
                                                    ).toLocaleDateString(
                                                        "pt-BR",
                                                        {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric"
                                                        }
                                                    )}
                                                </div>
                                                <div
                                                    className={`
                                                        px-4 h-10 rounded-xl
                                                        flex items-center gap-2
                                                        text-sm font-medium

                                                        ${invite.status ===
                                                            "pending"
                                                            ? `
                                                                    bg-yellow-500/15
                                                                    text-yellow-500
                                                                `
                                                            : `
                                                                    bg-emerald-500/15
                                                                    text-emerald-500
                                                                `
                                                        }
                                                    `}
                                                >
                                                    {invite.status ===
                                                        "pending" ? (
                                                        <Clock3
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    ) : (
                                                        <CheckCircle2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    )}

                                                    {invite.status ===
                                                        "pending"
                                                        ? "Pendente"
                                                        : "Aceito"}
                                                </div>


                                            </div>

                                            {/* RIGHT */}
                                            <div className="relative">
                                                <button
                                                    onClick={() =>
                                                        toggleInviteMenu(
                                                            invite.id
                                                        )
                                                    }
                                                    className="
                                                        w-11 h-11 rounded-2xl
                                                        flex items-center justify-center
                                                        hover:bg-zinc-200
                                                        dark:hover:bg-zinc-800
                                                        transition-all
                                                    "
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {openMenuId === invite.id && (
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            y: 10,
                                                            scale: 0.96
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                            scale: 1
                                                        }}
                                                        transition={{
                                                            duration: 0.15
                                                        }}
                                                        className={`
                                                            absolute right-0
                                                            ${index >= filteredInvites.length - 2
                                                                ? "bottom-14"
                                                                : "top-14"
                                                            }
                                                            w-56
                                                            rounded-2xl
                                                            border border-zinc-200 dark:border-zinc-800
                                                            bg-white dark:bg-[#111113]
                                                            shadow-2xl
                                                            overflow-hidden
                                                            z-[999]
                                                        `}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                handleCopyInvite(
                                                                    invite
                                                                )
                                                            }
                                                            className="
                                                                w-full h-12 px-4
                                                                flex items-center gap-2
                                                                text-sm font-medium
                                                                hover:bg-zinc-100
                                                                dark:hover:bg-zinc-800
                                                                transition-all
                                                            "
                                                        >
                                                            <Copy size={16} />
                                                            Copiar Token
                                                        </button>

                                                        <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                                                        <button
                                                            onClick={() =>
                                                                handleDeleteInvite(
                                                                    invite
                                                                )
                                                            }
                                                            className="
                                                                w-full h-12 px-4
                                                                flex items-center gap-2
                                                                text-sm font-medium
                                                                text-red-500
                                                                hover:bg-red-500/10
                                                                transition-all
                                                            "
                                                        >
                                                            <Trash2 size={16} />
                                                            Cancelar Convite
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            )}

                            {filteredInvites.length === 0 && (
                                <div
                                    className="
                                        py-20
                                        flex flex-col items-center justify-center
                                        text-center
                                    "
                                >
                                    <Mail
                                        size={48}
                                        className="text-zinc-700 mb-4"
                                    />

                                    <h3 className="text-xl font-semibold">
                                        Nenhum convite encontrado
                                    </h3>

                                    <p className="text-zinc-500 mt-2">
                                        Não existem convites com esse filtro.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.section>
                </motion.main>

                {/* MODAL */}
                {inviteModalOpen && (
                    <div
                        className="
                            fixed inset-0 z-[100]
                            bg-black/60
                            backdrop-blur-sm
                            flex items-center justify-center
                            p-4
                        "
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                                y: 20
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95
                            }}
                            transition={{
                                duration: 0.2
                            }}
                            className="
                                w-full max-w-xl
                                bg-white dark:bg-[#111113]
                                border border-zinc-200 dark:border-zinc-800
                                rounded-3xl
                                overflow-hidden
                                shadow-2xl
                            "
                        >
                            {/* HEADER */}
                            <div
                                className="
                                    flex items-center justify-between
                                    p-6
                                    border-b border-zinc-200 dark:border-zinc-800
                                "
                            >
                                <div>
                                    <h3 className="text-xl font-semibold tracking-tight">
                                        Novo Convite
                                    </h3>

                                    <p className="text-sm text-zinc-500 mt-1">
                                        Convide um novo usuário
                                    </p>
                                </div>

                                <button
                                    onClick={closeInviteModal}
                                    className="
                                        w-11 h-11 rounded-2xl
                                        flex items-center justify-center
                                        hover:bg-zinc-100
                                        dark:hover:bg-zinc-800
                                        transition-all
                                    "
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* CONTENT */}
                            <div className="p-6 space-y-6">
                                <div
                                    className="
                                        rounded-2xl
                                        border border-zinc-200 dark:border-zinc-800
                                        bg-zinc-50 dark:bg-[#09090B]
                                        p-5
                                        space-y-4
                                    "
                                >
                                    <div className="flex items-start gap-3">
                                        <Mail
                                            size={20}
                                            className="text-emerald-500 mt-0.5"
                                        />

                                        <div>
                                            <h4 className="font-medium">
                                                Como funciona o convite?
                                            </h4>

                                            <div className="mt-3 space-y-3 text-sm text-zinc-500 leading-relaxed">
                                                <p>
                                                    O usuário receberá um email com um link para realizar o cadastro no sistema.
                                                </p>

                                                <p>
                                                    Após finalizar o cadastro, a conta será criada sem nenhuma permissão ativa.
                                                </p>

                                                <p>
                                                    Para liberar acessos, o usuário deverá ser adicionado a um grupo de permissões por um gestor ou administrador.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* EMAIL */}
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-500">
                                        Email do usuário
                                    </label>

                                    <div
                                        className={`
                                            h-14 rounded-2xl
                                            border
                                            flex items-center gap-3
                                            px-4
                                            transition-all

                                            ${inviteEmail &&
                                                !validateEmail(inviteEmail)
                                                ? `
                                                        border-red-500/40
                                                        bg-red-500/5
                                                    `
                                                : `
                                                        border-zinc-200 dark:border-zinc-800
                                                        bg-zinc-50 dark:bg-[#09090B]
                                                    `
                                            }
                                        `}
                                    >
                                        <Mail
                                            size={18}
                                            className="text-zinc-500"
                                        />

                                        <input
                                            type="email"
                                            placeholder="usuario@empresa.com"
                                            value={inviteEmail}
                                            onChange={(e) =>
                                                setInviteEmail(
                                                    e.target.value
                                                )
                                            }
                                            className="
                                                bg-transparent outline-none
                                                w-full text-sm
                                                placeholder:text-zinc-500
                                            "
                                        />
                                    </div>

                                    {inviteEmail &&
                                        !validateEmail(inviteEmail) && (
                                            <p className="text-sm text-red-500">
                                                Informe um email válido
                                            </p>
                                        )}
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div
                                className="
                                    p-6
                                    border-t border-zinc-200 dark:border-zinc-800
                                    flex flex-col-reverse sm:flex-row
                                    gap-3
                                    sm:justify-end
                                "
                            >
                                <button
                                    onClick={closeInviteModal}
                                    disabled={inviteLoading}
                                    className="
                                        h-12 px-5 rounded-2xl
                                        bg-zinc-100 dark:bg-zinc-800
                                        hover:bg-zinc-200
                                        dark:hover:bg-zinc-700
                                        transition-all
                                        font-medium
                                    "
                                >
                                    Cancelar
                                </button>

                                <motion.button
                                    whileHover={{
                                        scale: 1.02
                                    }}
                                    whileTap={{
                                        scale: 0.98
                                    }}
                                    disabled={inviteLoading}
                                    onClick={handleInviteUser}
                                    className="
                                        h-12 px-5 rounded-2xl
                                        bg-emerald-500
                                        text-black
                                        font-semibold
                                        flex items-center justify-center gap-2
                                        disabled:opacity-50
                                    "
                                >
                                    <Send size={18} />

                                    {inviteLoading
                                        ? "Enviando..."
                                        : "Enviar Convite"}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
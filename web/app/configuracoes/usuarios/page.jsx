"use client";

import { useEffect, useState } from "react";

import {
    AlertTriangle,
    Menu,
    Search,
    Users,
    UserPlus,
    ShieldCheck,
    MoreVertical,
    Mail,
    Clock3,
    UserCheck,
    UserX,
    X,
    Send
} from "lucide-react";
import Link from "next/link";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Sidebar from "../../_components/Sidebar";

export default function Usuarios() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hasPermission, setHasPermission] = useState(true);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [totalActive, setTotalActive] = useState(0);
    const [totalInvitesPending, setTotalInvitesPending] = useState(0);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [openMenuId, setOpenMenuId] = useState(null);

    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);

    // FUNÇÕES
    function closeInviteModal() {
        setInviteModalOpen(false);
        setInviteEmail("");
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function toggleUserMenu(userId) {
        setOpenMenuId((prev) =>
            prev === userId ? null : userId
        );
    }

    function handleEditUser(user) {
        setOpenMenuId(null);

        toast.success(
            `Editar usuário: ${user.name}`
        );
    }

    function handlePermissions(user) {
        setOpenMenuId(null);

        toast.success(
            `Permissões de ${user.name}`
        );
    }

    function handleDisableUser(user) {
        setOpenMenuId(null);

        toast.success(
            `Inativar usuário: ${user.name}`
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
            const res = await fetch("/api/configs/users", { METHOD: "GET" });

            if (res.status === 403) {
                setHasPermission(false);
                toast.error("Acesso negado");
                return;
            }

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(
                    data.message ||
                    "Erro ao carregar usuários"
                );
                return;
            }
            setHasPermission(true);

            setUsers(data.users || []);
            setTotalActive(data.total_active || 0);
            setTotalInvitesPending(data.total_pending || 0);
            setTotalAdmins(data.total_admin || 0);

        } catch (error) {
            console.error(error);

            toast.error(
                "Erro ao carregar usuários"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData(new Event("fetch"));
    }, []);

    const filteredUsers = users.filter((user) =>
        user.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

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

    if (!hasPermission) {
        return (
            <div className="min-h-screen bg-zinc-100 dark:bg-[#09090B] text-zinc-900 dark:text-white overflow-hidden">
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <div className="lg:ml-72 min-h-screen flex items-center justify-center">
                    <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center">
                        <AlertTriangle
                            size={48}
                            className="mx-auto mb-4 text-red-500"
                        />

                        <h2 className="text-2xl font-semibold mb-2">
                            Acesso Negado
                        </h2>

                        <p className="text-zinc-500">
                            Você não tem permissão para
                            acessar esta página.
                        </p>
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
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} >
                            <h2 className="text-2xl font-bold tracking-tight"> Usuários </h2>
                            <p className="text-sm text-zinc-500 mt-1"> Gerencie usuários e acessos do sistema </p>
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
                    {/* CARDS */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                title:
                                    "Usuários Ativos",
                                value: totalActive,
                                subtitle:
                                    "Atualmente ativos",
                                icon: Users,
                                url: "#"
                            },

                            {
                                title:
                                    "Convites Pendentes",
                                value: totalInvitesPending,
                                subtitle:
                                    "Aguardando ativação",
                                icon: Mail,
                                url: "/configuracoes/usuarios/convites"
                            },

                            {
                                title:
                                    "Administradores",
                                value: totalAdmins,
                                subtitle:
                                    "Acesso total",
                                icon: ShieldCheck,
                                url: "/configuracoes/permissoes"
                            }
                        ].map((card) => {
                            const Icon = card.icon;

                            return (
                                <motion.div
                                    key={card.title}
                                    variants={item}
                                    whileHover={{
                                        y: -4
                                    }}
                                    className="
                                        bg-white dark:bg-[#111113]
                                        border border-zinc-200 dark:border-zinc-800
                                        rounded-3xl p-6
                                    "
                                >
                                    <Link href={card.url}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm text-zinc-500">
                                                    {
                                                        card.title
                                                    }
                                                </p>

                                                <h3 className="text-4xl font-bold mt-4 tracking-tight">
                                                    {
                                                        card.value
                                                    }
                                                </h3>

                                                <p className="text-sm text-emerald-500 mt-3">
                                                    {
                                                        card.subtitle
                                                    }
                                                </p>
                                            </div>

                                            <div
                                                className="
                                                    w-12 h-12 rounded-2xl
                                                    bg-zinc-100 dark:bg-zinc-800
                                                    flex items-center justify-center
                                                    text-emerald-500
                                                "
                                            >
                                                <Icon
                                                    size={
                                                        22
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </section>

                    {/* USERS TABLE */}
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
                                    Usuários do Sistema
                                </h3>

                                <p className="text-sm text-zinc-500 mt-1">
                                    Controle acessos,
                                    permissões e status
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
                                    placeholder="Buscar usuário..."
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

                        {/* USERS */}
                        <div className="p-4 space-y-3">
                            {filteredUsers.map(
                                (user, index) => (
                                    <motion.div
                                        key={user.id}
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
                                                <img
                                                    src={
                                                        user.avatar || "../default-avatar.png"
                                                    }
                                                    alt={
                                                        user.name
                                                    }
                                                    className="
                                                        w-14 h-14 rounded-2xl
                                                        object-cover
                                                    "
                                                />

                                                <div>
                                                    <h4 className="font-semibold text-lg tracking-tight">
                                                        {
                                                            user.name
                                                        }
                                                    </h4>

                                                    <p className="text-sm text-zinc-500 mt-1">
                                                        {
                                                            user.email
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* CENTER */}
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div
                                                    className="
                                                        px-4 h-10 rounded-xl
                                                        bg-zinc-200 dark:bg-zinc-800
                                                        flex items-center
                                                        text-sm font-medium
                                                    "
                                                >
                                                    {
                                                        user.role
                                                    }
                                                </div>

                                                <div
                                                    className={`
                                                        px-4 h-10 rounded-xl
                                                        flex items-center gap-2
                                                        text-sm font-medium

                                                        ${user.status ===
                                                            "active"
                                                            ? `
                                                                    bg-emerald-500/15
                                                                    text-emerald-500
                                                                `
                                                            : user.status ===
                                                                "pending"
                                                                ? `
                                                                    bg-yellow-500/15
                                                                    text-yellow-500
                                                                `
                                                                : `
                                                                    bg-red-500/15
                                                                    text-red-500
                                                                `
                                                        }
                                                    `}
                                                >
                                                    {user.status ===
                                                        "active" ? (
                                                        <UserCheck
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    ) : user.status ===
                                                        "pending" ? (
                                                        <Clock3
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    ) : (
                                                        <UserX
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    )}

                                                    {user.status ===
                                                        "active"
                                                        ? "Ativo"
                                                        : user.status ===
                                                            "pending"
                                                            ? "Pendente"
                                                            : "Inativo"}
                                                </div>

                                                <div
                                                    className="
                                                        text-sm text-zinc-500
                                                    "
                                                >
                                                    Último
                                                    acesso:{" "}
                                                    {
                                                        user.lastAccess
                                                    }
                                                </div>
                                            </div>

                                            {/* RIGHT */}
                                            <div className="relative">
                                                <button
                                                    onClick={() =>
                                                        toggleUserMenu(user.id)
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

                                                {openMenuId === user.id && (
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
                                                            ${index >= filteredUsers.length - 2
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
                                                                handleEditUser(user)
                                                            }
                                                            className="
                                                                w-full h-12 px-4
                                                                flex items-center
                                                                text-sm font-medium
                                                                hover:bg-zinc-100
                                                                dark:hover:bg-zinc-800
                                                                transition-all
                                                            "
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handlePermissions(user)
                                                            }
                                                            className="
                                                                w-full h-12 px-4
                                                                flex items-center
                                                                text-sm font-medium
                                                                hover:bg-zinc-100
                                                                dark:hover:bg-zinc-800
                                                                transition-all
                                                            "
                                                        >
                                                            Permissões
                                                        </button>

                                                        <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                                                        <button
                                                            onClick={() =>
                                                                handleDisableUser(user)
                                                            }
                                                            className="
                                                                w-full h-12 px-4
                                                                flex items-center
                                                                text-sm font-medium
                                                                text-red-500
                                                                hover:bg-red-500/10
                                                                transition-all
                                                            "
                                                        >
                                                            Inativar
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            )}
                        </div>
                    </motion.section>
                </motion.main>

                {/* MODAL CONVITE */}
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
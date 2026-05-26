"use client";

import {
    AlertTriangle,
    ShieldCheck,
    Users,
    Plus,
    Search,
    MoreVertical,
    CheckCircle2,
    Pencil,
    Trash2,
    Copy,
    Save,
    ChevronRight,
    Menu,
    ChevronDown,
    UserPlus,
    Mail,
    UserCheck,
    X
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Sidebar from "../../_components/Sidebar";


export default function Permissoes() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hasPermission, setHasPermission] = useState(true);
    const [groups, setGroups] = useState([]);
    const [allPermissions, setAllPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState(1);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [usersExpanded, setUsersExpanded] = useState(false);
    const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);

    const [newRole, setNewRole] = useState({
        name: "",
        description: ""
    });

    async function fetchData() {
        try {

            setLoading(true);

            const response = await fetch("/api/configs/permitions");
            const result = await response.json();
            if (result.status === 403) {
                setHasPermission(false);
                return;
            }

            if (!result.success) {
                toast.error(result.message || "Erro ao carregar permissões");
                return;
            }

            const roles = result?.data?.roles || [];
            const permissions = result?.data?.permissions || [];

            setGroups(roles);
            setAllPermissions(permissions);

            if (roles.length > 0) {
                setSelectedGroupId(roles[0].id);
            }

        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar permissões");
        } finally {
            setLoading(false);
        }
    }

    async function createRole() {

        if (!newRole.name.trim()) {
            toast.error("Informe o nome do grupo");
            return;
        }

        const response = await fetch("/api/configs/permitions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: newRole.name, description: newRole.description })
        });

        const result = await response.json();

        if (!result.success) {
            toast.error(result.message || "Erro ao criar grupo");
            return;
        }

        setNewRole({
            name: "",
            description: ""
        });

        await fetchData();
        setCreateRoleModalOpen(false);

        toast.success("Grupo criado");

    }

    useEffect(() => {
        fetchData();
    }, []);

    const permissionCategories = [
        { key: "dashboard", label: "Dashboard" },
        { key: "inventory", label: "Estoque" },
        { key: "reports", label: "Relatórios" },
        { key: "out_transactions", label: "Transações de Saída" },
        { key: "in_transactions", label: "Transações de Entrada" },
        { key: "config", label: "Configurações" },
        { key: "activities", label: "Atividades" },
        { key: "users", label: "Usuários" },
        { key: "roles", label: "Cargos" },
        { key: "permissions", label: "Permissões" },
        { key: "assign_roles", label: "Atribuir Cargos" }
    ];

    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const permissionGroups = useMemo(() => {
        return permissionCategories.map((category) => ({
            ...category,
            permissions: (allPermissions || []).filter((permission) =>
                permission.key.startsWith(`${category.key}.`)
            )
        }));
    }, [allPermissions]);

    const menuRef = useRef(null);

    /*
    |--------------------------------------------------------------------------
    | COMPUTED
    |--------------------------------------------------------------------------
    */

    const filteredGroups = useMemo(() => {
        return (groups || []).filter((group) =>
            group.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [groups, search]);

    const selectedGroup = useMemo(() => {
        return (groups || []).find((g) => g.id === selectedGroupId);
    }, [groups, selectedGroupId]);

    const totalUsers = useMemo(() => {

        const userSet = new Set();

        (groups || []).forEach((group) => {

            (group.users || []).forEach((user) => {
                userSet.add(user.id);
            });

        });

        return userSet.size;

    }, [groups]);

    const totalPermissions = allPermissions?.length || 0;

    /*
    |--------------------------------------------------------------------------
    | EFFECTS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setMenuOpenId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    /*
    |--------------------------------------------------------------------------
    | ACTIONS
    |--------------------------------------------------------------------------
    */

    function toggleGroupPermission(permissionKey) {

        if (!selectedGroup) return;

        if (selectedGroup?.system) {
            toast.error("O grupo administrador não pode ser editado");
            return;
        }

        setGroups((prevGroups) =>
            prevGroups.map((group) => {
                if (group.id !== selectedGroup.id) return group;

                const hasPermission = group.permissions.includes(permissionKey);

                return {
                    ...group,
                    permissions: hasPermission
                        ? group.permissions.filter((p) => p !== permissionKey)
                        : [...group.permissions, permissionKey]
                };
            })
        );

    }

    function toggleCategory(categoryKey) {
        if (!selectedGroup) return;

        if (selectedGroup?.system) {
            toast.error("O grupo administrador não pode ser editado");
            return;
        }

        const category = permissionGroups.find((group) => group.key === categoryKey);
        if (!category) return;

        const categoryKeys = category.permissions.map((permission) => permission.key);
        const allSelected = categoryKeys.every((key) => selectedGroup.permissions.includes(key));

        setGroups((prevGroups) =>
            prevGroups.map((group) => {
                if (group.id !== selectedGroup.id) return group;

                return {
                    ...group,
                    permissions: allSelected
                        ? group.permissions.filter((permission) => !categoryKeys.includes(permission))
                        : Array.from(new Set([...group.permissions, ...categoryKeys]))
                };
            })
        );
    }

    async function updateRolePermissions() {
        
    }

    function duplicateGroup(groupId) {

        const group = groups.find((g) => g.id === groupId);

        if (!group) return;

        if (group.system) {
            toast.error("O grupo administrador não pode ser duplicado");
            return;
        }

        

        toast.success("Grupo duplicado");

    }

    function deleteGroup(groupId) {

        const group = groups.find((g) => g.id === groupId);

        if (!group) return;

        if (group.system) {
            toast.error("O grupo administrador não pode ser removido");
            return;
        }

        if (groups.length <= 1) {
            toast.error("É necessário ao menos um grupo");
            return;
        }

        

        toast.success("Grupo removido");

    }

    if (loading) {
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
                                <h2 className="text-2xl font-bold tracking-tight"> Permissões </h2>
                                <p className="text-sm text-zinc-500 mt-1"> Gerencie as permissões do sistema </p>
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
                                <p className="text-zinc-500">Carregando permissões...</p>
                            </div>
                        </div>
                    </motion.main>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | NO PERMISSION
    |--------------------------------------------------------------------------
    */

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
                                <h2 className="text-2xl font-bold tracking-tight"> Permissões </h2>
                                <p className="text-sm text-zinc-500 mt-1"> Gerencie as permissões do sistema </p>
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

    /*
    |--------------------------------------------------------------------------
    | PAGE
    |--------------------------------------------------------------------------
    */

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
                    <div className="flex items-center justify-between w-full gap-4">
                        <button
                            className="lg:hidden"
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                        >
                            <Menu size={24} />
                        </button>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} >
                            <h2 className="text-2xl font-bold tracking-tight">Permissões por Grupo</h2>
                            <p className="text-sm text-zinc-500 mt-1">Gerencie as permissões dos grupos do sistema</p>
                        </motion.div>
                        <button
                            onClick={() => setCreateRoleModalOpen(true)}
                            className="
                                h-11 px-5
                                rounded-2xl
                                bg-emerald-500
                                hover:bg-emerald-400
                                text-black
                                font-semibold
                                transition-all
                                flex items-center gap-2
                                shrink-0
                            "
                        >
                            <Plus size={18} />
                            Novo Grupo
                        </button>
                    </div>
                </header>

                {/* CONTENT */}
                <main className="flex-1 p-4 lg:p-8 space-y-6">

                    {/* STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {[
                            {
                                title: "Grupos",
                                value: groups.length,
                                icon: ShieldCheck
                            },
                            {
                                title: "Permissões",
                                value: totalPermissions,
                                icon: Users
                            }
                        ].map((card) => {

                            const Icon = card.icon;

                            return (
                                <motion.div
                                    key={card.title}
                                    whileHover={{ y: -4 }}
                                    className="
                                        bg-white dark:bg-[#111113]
                                        border border-zinc-200 dark:border-zinc-800
                                        rounded-3xl
                                        p-6
                                    "
                                >
                                    <div className="flex items-start justify-between">

                                        <div>
                                            <p className="text-sm text-zinc-500">
                                                {card.title}
                                            </p>

                                            <h2 className="text-4xl font-bold mt-4 tracking-tight">
                                                {card.value}
                                            </h2>
                                        </div>

                                        <div
                                            className="
                                                w-12 h-12
                                                rounded-2xl
                                                bg-emerald-500/10
                                                text-emerald-500
                                                flex items-center justify-center
                                            "
                                        >
                                            <Icon size={22} />
                                        </div>

                                    </div>
                                </motion.div>
                            );

                        })}

                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">

                        {/* GROUPS */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="
                                bg-white dark:bg-[#111113]
                                border border-zinc-200 dark:border-zinc-800
                                rounded-3xl
                                overflow-hidden
                                flex flex-col
                            "
                        >

                            {/* SEARCH */}
                            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">

                                <div
                                    className="
                                        h-12
                                        rounded-2xl
                                        border border-zinc-200 dark:border-zinc-800
                                        bg-zinc-50 dark:bg-[#09090B]
                                        px-4
                                        flex items-center gap-3
                                    "
                                >
                                    <Search
                                        size={18}
                                        className="text-zinc-500"
                                    />

                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        type="text"
                                        placeholder="Buscar grupos..."
                                        className="
                                            bg-transparent
                                            outline-none
                                            w-full
                                            text-sm
                                            placeholder:text-zinc-500
                                        "
                                    />
                                </div>

                            </div>

                            {/* LIST */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {filteredGroups.map((group) => {

                                    const active =
                                        selectedGroupId === group.id;

                                    return (
                                        <div
                                            key={group.id}
                                            className={`
                                                rounded-3xl
                                                border
                                                transition-all
                                                relative

                                                ${
                                                    active
                                                        ? `
                                                            border-emerald-500/40
                                                            bg-emerald-500/10
                                                        `
                                                        : `
                                                            border-zinc-200 dark:border-zinc-800
                                                            bg-zinc-50 dark:bg-[#09090B]
                                                        `
                                                }
                                            `}
                                        >

                                            <div
                                                onClick={() => setSelectedGroupId(group.id)}
                                                className="w-full text-left p-5"
                                            >

                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="flex-1">

                                                        <div className="flex items-center gap-2 flex-wrap">

                                                            <h3 className="font-semibold text-base tracking-tight">
                                                                {group.name}
                                                            </h3>

                                                            {group.system && (
                                                                <div
                                                                    className="
                                                                        h-6 px-2
                                                                        rounded-lg
                                                                        bg-amber-500/15
                                                                        text-amber-500
                                                                        text-[11px]
                                                                        font-semibold
                                                                        flex items-center
                                                                    "
                                                                >
                                                                    Sem edição
                                                                </div>
                                                            )}

                                                            {active && (
                                                                <ChevronRight
                                                                    size={16}
                                                                    className="text-emerald-500"
                                                                />
                                                            )}

                                                        </div>

                                                        <p className="text-sm text-zinc-500 mt-1">
                                                            {group.description}
                                                        </p>

                                                        <div className="flex items-center gap-2 mt-4">

                                                            <div
                                                                className="
                                                                    inline-flex items-center gap-2
                                                                    px-3 h-8
                                                                    rounded-xl
                                                                    bg-zinc-200 dark:bg-zinc-800
                                                                    text-xs font-medium
                                                                "
                                                            >
                                                                <Users size={14} />
                                                                {group.users.length} usuários
                                                            </div>

                                                            <div
                                                                className="
                                                                    inline-flex items-center gap-2
                                                                    px-3 h-8
                                                                    rounded-xl
                                                                    bg-zinc-200 dark:bg-zinc-800
                                                                    text-xs font-medium
                                                                "
                                                            >
                                                                <ShieldCheck size={14} />
                                                                {group.permissions.length}
                                                            </div>

                                                        </div>

                                                    </div>

                                                    {/* MENU */}
                                                    <div className="relative" ref={menuRef}>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();

                                                                setMenuOpenId(
                                                                    menuOpenId === group.id
                                                                        ? null
                                                                        : group.id
                                                                );
                                                            }}
                                                            className="
                                                                w-10 h-10
                                                                rounded-xl
                                                                hover:bg-zinc-200
                                                                dark:hover:bg-zinc-800
                                                                transition-all
                                                                flex items-center justify-center
                                                            "
                                                        >
                                                            <MoreVertical size={18} />
                                                        </button>

                                                        <AnimatePresence>

                                                            {menuOpenId === group.id && (
                                                                <motion.div
                                                                    initial={{
                                                                        opacity: 0,
                                                                        y: -8
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        y: 0
                                                                    }}
                                                                    exit={{
                                                                        opacity: 0,
                                                                        y: -8
                                                                    }}
                                                                    className="
                                                                        absolute
                                                                        right-0
                                                                        top-12
                                                                        z-50
                                                                        w-56
                                                                        rounded-2xl
                                                                        border border-zinc-200 dark:border-zinc-800
                                                                        bg-white dark:bg-[#18181B]
                                                                        shadow-2xl
                                                                        overflow-hidden
                                                                    "
                                                                >

                                                                    <button
                                                                        className="
                                                                            h-12 px-4 w-full
                                                                            flex items-center gap-3
                                                                            hover:bg-zinc-100
                                                                            dark:hover:bg-zinc-800
                                                                            text-sm
                                                                        "
                                                                    >
                                                                        <Pencil size={16} />
                                                                        Editar Grupo
                                                                    </button>

                                                                    <button
                                                                        onClick={() =>
                                                                            duplicateGroup(group.id)
                                                                        }
                                                                        className="
                                                                            h-12 px-4 w-full
                                                                            flex items-center gap-3
                                                                            hover:bg-zinc-100
                                                                            dark:hover:bg-zinc-800
                                                                            text-sm
                                                                        "
                                                                    >
                                                                        <Copy size={16} />
                                                                        Duplicar Grupo
                                                                    </button>

                                                                    <div className="border-t border-zinc-200 dark:border-zinc-800" />

                                                                    <button
                                                                        onClick={() =>
                                                                            deleteGroup(group.id)
                                                                        }
                                                                        className="
                                                                            h-12 px-4 w-full
                                                                            flex items-center gap-3
                                                                            text-red-500
                                                                            hover:bg-red-500/10
                                                                            text-sm
                                                                        "
                                                                    >
                                                                        <Trash2 size={16} />
                                                                        Excluir Grupo
                                                                    </button>

                                                                </motion.div>
                                                            )}

                                                        </AnimatePresence>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                })}
                            </div>

                        </motion.div>

                        {/* RIGHT CONTENT */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="
                                bg-white dark:bg-[#111113]
                                border border-zinc-200 dark:border-zinc-800
                                rounded-3xl
                                overflow-hidden
                                flex flex-col
                            "
                        >

                            {selectedGroup && (
                                <>
                                    {/* HEADER */}
                                    <div
                                        className="
                                            p-8
                                            border-b border-zinc-200 dark:border-zinc-800
                                            flex flex-col lg:flex-row
                                            lg:items-center
                                            justify-between
                                            gap-5
                                        "
                                    >

                                        <div className="flex items-center gap-4">

                                            <div
                                                className="
                                                    w-14 h-14
                                                    rounded-2xl
                                                    bg-emerald-500/10
                                                    text-emerald-500
                                                    flex items-center justify-center
                                                "
                                            >
                                                <ShieldCheck size={26} />
                                            </div>

                                            <div>

                                                <h2 className="text-3xl font-bold tracking-tight">
                                                    {selectedGroup.name}
                                                </h2>

                                                <p className="text-zinc-500 mt-1">
                                                    {selectedGroup.description}
                                                </p>

                                            </div>

                                        </div>
                                        {selectedGroup.system ? (
                                            <div
                                                className="
                                                    px-5 py-4
                                                    rounded-2xl
                                                    bg-amber-500/15
                                                    text-amber-500
                                                    text-sm
                                                    font-semibold
                                                    flex flex-col
                                                    gap-2
                                                "
                                            >

                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle size={16} />
                                                    <h2>Grupo do sistema</h2>
                                                </div>

                                                <p className="text-xs text-amber-500/80 font-medium">
                                                    As permissões deste grupo não podem ser editadas.
                                                </p>

                                            </div>
                                        ) : (
                                            <button
                                                onClick={async() =>
                                                    await updateRolePermissions()
                                                }
                                                className="
                                                    h-11 px-5
                                                    rounded-2xl
                                                    bg-emerald-500
                                                    hover:bg-emerald-400
                                                    text-black
                                                    font-semibold
                                                    transition-all
                                                    flex items-center gap-2
                                                "
                                            >
                                                <Save size={16} />
                                                Salvar Alterações
                                            </button>
                                        )}
                                    </div>

                                    {/* BODY */}
                                    <div className="p-8 space-y-8 flex-1 overflow-y-auto">

                                        {/* USERS */}
                                        <section
                                            className="
                                                rounded-3xl
                                                border border-zinc-200 dark:border-zinc-800
                                                bg-zinc-50 dark:bg-[#09090B]
                                                overflow-hidden
                                            "
                                        >

                                            <button
                                                onClick={() => setUsersExpanded(!usersExpanded)}
                                                className="
                                                    w-full
                                                    p-6
                                                    flex items-center justify-between
                                                    text-left
                                                    hover:bg-zinc-100 dark:hover:bg-zinc-800/40
                                                    transition-all
                                                "
                                            >

                                                <div className="flex items-center gap-4">

                                                    <div
                                                        className="
                                                            w-12 h-12
                                                            rounded-2xl
                                                            bg-emerald-500/10
                                                            text-emerald-500
                                                            flex items-center justify-center
                                                        "
                                                    >
                                                        <Users size={22} />
                                                    </div>

                                                    <div>

                                                        <h3 className="text-xl font-semibold tracking-tight">
                                                            Usuários no Grupo
                                                        </h3>

                                                        <p className="text-sm text-zinc-500 mt-1">
                                                            {(selectedGroup.users || []).length} usuário(s) vinculados
                                                        </p>

                                                    </div>

                                                </div>

                                                <motion.div
                                                    animate={{
                                                        rotate: usersExpanded ? 180 : 0
                                                    }}
                                                >
                                                    <ChevronDown size={22} />
                                                </motion.div>

                                            </button>

                                            <AnimatePresence>

                                                {usersExpanded && (

                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            height: 0
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            height: "auto"
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            height: 0
                                                        }}
                                                        transition={{
                                                            duration: 0.25
                                                        }}
                                                        className="border-t border-zinc-200 dark:border-zinc-800"
                                                    >

                                                        <div className="p-6">

                                                            {/* HEADER */}
                                                            <div
                                                                className="
                                                                    flex flex-col sm:flex-row
                                                                    sm:items-center
                                                                    sm:justify-between
                                                                    gap-4
                                                                    mb-6
                                                                "
                                                            >

                                                                <div>

                                                                    <h4 className="font-semibold text-lg">
                                                                        Membros do Grupo
                                                                    </h4>

                                                                    <p className="text-sm text-zinc-500 mt-1">
                                                                        Gerencie os usuários vinculados a este grupo
                                                                    </p>

                                                                </div>

                                                                <button
                                                                    onClick={() =>
                                                                        toast.success("Abrir modal para adicionar usuário")
                                                                    }
                                                                    className="
                                                                        h-11 px-4
                                                                        rounded-2xl
                                                                        bg-emerald-500
                                                                        hover:bg-emerald-400
                                                                        text-black
                                                                        font-semibold
                                                                        transition-all
                                                                        flex items-center gap-2
                                                                        shrink-0
                                                                    "
                                                                >
                                                                    <UserPlus size={18} />
                                                                    Adicionar Usuário
                                                                </button>

                                                            </div>

                                                            {/* USERS LIST */}
                                                            <div className="space-y-3">

                                                                {(selectedGroup.users || []).length <= 0 && (

                                                                    <div
                                                                        className="
                                                                            rounded-2xl
                                                                            border border-dashed
                                                                            border-zinc-300 dark:border-zinc-700
                                                                            p-8
                                                                            text-center
                                                                        "
                                                                    >

                                                                        <Users
                                                                            size={36}
                                                                            className="mx-auto text-zinc-500 mb-3"
                                                                        />

                                                                        <h5 className="font-semibold">
                                                                            Nenhum usuário vinculado
                                                                        </h5>

                                                                        <p className="text-sm text-zinc-500 mt-2">
                                                                            Adicione usuários para este grupo
                                                                        </p>

                                                                    </div>

                                                                )}

                                                                {(selectedGroup.users || []).map((user) => (

                                                                    <motion.div
                                                                        key={user.id}
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
                                                                            border border-zinc-200 dark:border-zinc-800
                                                                            bg-white dark:bg-[#111113]
                                                                            p-4
                                                                            flex flex-col lg:flex-row
                                                                            lg:items-center
                                                                            justify-between
                                                                            gap-4
                                                                        "
                                                                    >

                                                                        <div className="flex items-center gap-4">

                                                                            <div
                                                                                className="
                                                                                    w-12 h-12
                                                                                    rounded-2xl
                                                                                    bg-zinc-200 dark:bg-zinc-800
                                                                                    flex items-center justify-center
                                                                                    font-semibold
                                                                                    text-sm
                                                                                "
                                                                            >
                                                                                {user.name
                                                                                    ?.split(" ")
                                                                                    ?.map((n) => n[0])
                                                                                    ?.slice(0, 2)
                                                                                    ?.join("")}
                                                                            </div>

                                                                            <div>

                                                                                <div className="flex items-center gap-2 flex-wrap">

                                                                                    <h5 className="font-semibold">
                                                                                        {user.name}
                                                                                    </h5>

                                                                                    <div
                                                                                        className={`
                                                                                            h-6 px-2
                                                                                            rounded-lg
                                                                                            text-[11px]
                                                                                            font-semibold
                                                                                            flex items-center

                                                                                            ${
                                                                                                user.active
                                                                                                    ? `
                                                                                                        bg-emerald-500/15
                                                                                                        text-emerald-500
                                                                                                    `
                                                                                                    : `
                                                                                                        bg-red-500/15
                                                                                                        text-red-500
                                                                                                    `
                                                                                            }
                                                                                        `}
                                                                                    >
                                                                                        {user.active
                                                                                            ? "Ativo"
                                                                                            : "Inativo"}
                                                                                    </div>

                                                                                </div>

                                                                                <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">

                                                                                    <Mail size={14} />

                                                                                    <span>
                                                                                        {user.email}
                                                                                    </span>

                                                                                </div>

                                                                            </div>

                                                                        </div>

                                                                        <div className="flex items-center gap-2">

                                                                            <button
                                                                                className="
                                                                                    h-10 px-4
                                                                                    rounded-xl
                                                                                    bg-zinc-100 dark:bg-zinc-800
                                                                                    hover:bg-zinc-200 dark:hover:bg-zinc-700
                                                                                    transition-all
                                                                                    text-sm
                                                                                    font-medium
                                                                                    flex items-center gap-2
                                                                                "
                                                                            >
                                                                                <UserCheck size={16} />
                                                                                Gerenciar
                                                                            </button>

                                                                        </div>

                                                                    </motion.div>

                                                                ))}

                                                            </div>

                                                        </div>

                                                    </motion.div>

                                                )}

                                            </AnimatePresence>

                                        </section>

                                        {/* PERMISSIONS */}
                                        <section>

                                            <div className="mb-5">

                                                <h3 className="text-xl font-semibold tracking-tight">
                                                    Permissões do Grupo
                                                </h3>

                                                <p className="text-sm text-zinc-500 mt-1">
                                                    {selectedGroup.permissions.length} de {totalPermissions} permissões ativas
                                                </p>

                                            </div>

                                            <div className="space-y-6">
                                                {permissionGroups.map((category) => {
                                                    const categoryKeys = category.permissions.map((permission) => permission.key);
                                                    const selectedCount = categoryKeys.filter((key) =>
                                                        selectedGroup.permissions.includes(key)
                                                    ).length;
                                                    const allSelected =
                                                        selectedCount === category.permissions.length && category.permissions.length > 0;

                                                    return (
                                                        <div
                                                            key={category.key}
                                                            className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090B] p-5"
                                                        >
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                                                                <div>
                                                                    <h4 className="text-lg font-semibold">
                                                                        {category.label}
                                                                    </h4>
                                                                    <p className="text-sm text-zinc-500 mt-1">
                                                                        {selectedCount} de {category.permissions.length} permissões
                                                                    </p>
                                                                </div>
                                                                {selectedGroup.system ? (
                                                                    <div
                                                                        className="text-sm text-amber-500 flex items-center gap-2"
                                                                    >
                                                                        As permissões deste grupo não podem ser editadas.
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => toggleCategory(category.key)}
                                                                        className="
                                                                            h-11 px-4
                                                                            rounded-2xl
                                                                            bg-zinc-100 dark:bg-zinc-800
                                                                            hover:bg-zinc-200 dark:hover:bg-zinc-700
                                                                            transition-all
                                                                            text-sm font-semibold
                                                                        "
                                                                    >
                                                                        {allSelected ? "Remover todas" : "Selecionar todas"}
                                                                    </button>
                                                                )}
                                                            </div>

                                                            <div className="grid sm:grid-cols-2 gap-3">
                                                                {category.permissions.map((permission) => {
                                                                    const enabled = selectedGroup.permissions.includes(permission.key);

                                                                    return (
                                                                        <button
                                                                            key={permission.key}
                                                                            onClick={() => toggleGroupPermission(permission.key)}
                                                                            className={`
                                                                                h-14 px-4
                                                                                rounded-2xl
                                                                                border
                                                                                border-zinc-200 dark:border-zinc-800
                                                                                text-left
                                                                                transition-all
                                                                                ${
                                                                                    enabled
                                                                                        ? "bg-emerald-500/10 border-emerald-500/30"
                                                                                        : "bg-white dark:bg-[#111113] hover:border-emerald-500/30"
                                                                                }
                                                                            `}
                                                                        >
                                                                            <div className="flex items-center justify-between gap-3">
                                                                                <div>
                                                                                    <h5 className="font-medium">
                                                                                        {permission.description}
                                                                                    </h5>
                                                                                    <p className="text-xs text-zinc-500 mt-1">
                                                                                        {permission.key}
                                                                                    </p>
                                                                                </div>
                                                                                <div
                                                                                    className={`
                                                                                        w-7 h-7 rounded-full flex items-center justify-center
                                                                                        ${enabled ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"}
                                                                                    `}
                                                                                >
                                                                                    <CheckCircle2
                                                                                        size={14}
                                                                                        className={enabled ? "text-black" : "text-zinc-500"}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                        </section>

                                    </div>
                                </>
                            )}

                        </motion.div>
                    </div>
                </main>
                {/* CREATE ROLE MODAL */}
                <AnimatePresence>

                    {createRoleModalOpen && (

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="
                                fixed inset-0
                                z-[100]
                                bg-black/60
                                backdrop-blur-sm
                                flex items-center justify-center
                                p-4
                            "
                        >

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.95,
                                    y: 10
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.95,
                                    y: 10
                                }}
                                transition={{
                                    duration: 0.2
                                }}
                                className="
                                    w-full max-w-xl
                                    rounded-3xl
                                    border border-zinc-200 dark:border-zinc-800
                                    bg-white dark:bg-[#111113]
                                    overflow-hidden
                                    shadow-2xl
                                "
                            >

                                {/* HEADER */}
                                <div
                                    className="
                                        h-20 px-6
                                        border-b border-zinc-200 dark:border-zinc-800
                                        flex items-center justify-between
                                    "
                                >

                                    <div>

                                        <h2 className="text-xl font-bold tracking-tight">
                                            Novo Grupo
                                        </h2>

                                        <p className="text-sm text-zinc-500 mt-1">
                                            Crie um novo grupo de permissões
                                        </p>

                                    </div>

                                    <button
                                        onClick={() =>
                                            setCreateRoleModalOpen(false)
                                        }
                                        className="
                                            w-11 h-11
                                            rounded-2xl
                                            hover:bg-zinc-100
                                            dark:hover:bg-zinc-800
                                            transition-all
                                            flex items-center justify-center
                                        "
                                    >
                                        <X size={20} />
                                    </button>

                                </div>

                                {/* BODY */}
                                <div className="p-6 space-y-5">

                                    {/* NAME */}
                                    <div>

                                        <label className="text-sm font-medium block mb-2">
                                            Nome do Grupo
                                        </label>

                                        <input
                                            type="text"
                                            value={newRole.name}
                                            onChange={(e) =>
                                                setNewRole((prev) => ({
                                                    ...prev,
                                                    name: e.target.value
                                                }))
                                            }
                                            placeholder="Ex: Financeiro"
                                            className="
                                                w-full h-12 px-4
                                                rounded-2xl
                                                border border-zinc-200 dark:border-zinc-800
                                                bg-zinc-50 dark:bg-[#09090B]
                                                outline-none
                                                focus:border-emerald-500
                                                transition-all
                                            "
                                        />

                                    </div>

                                    {/* DESCRIPTION */}
                                    <div>

                                        <label className="text-sm font-medium block mb-2">
                                            Descrição
                                        </label>

                                        <textarea
                                            rows={4}
                                            value={newRole.description}
                                            onChange={(e) =>
                                                setNewRole((prev) => ({
                                                    ...prev,
                                                    description: e.target.value
                                                }))
                                            }
                                            placeholder="Descrição do grupo..."
                                            className="
                                                w-full px-4 py-3
                                                rounded-2xl
                                                border border-zinc-200 dark:border-zinc-800
                                                bg-zinc-50 dark:bg-[#09090B]
                                                outline-none
                                                resize-none
                                                focus:border-emerald-500
                                                transition-all
                                            "
                                        />

                                    </div>

                                </div>

                                {/* FOOTER */}
                                <div
                                    className="
                                        p-6 pt-0
                                        flex items-center justify-end gap-3
                                    "
                                >

                                    <button
                                        onClick={() =>
                                            setCreateRoleModalOpen(false)
                                        }
                                        className="
                                            h-11 px-5
                                            rounded-2xl
                                            bg-zinc-100 dark:bg-zinc-800
                                            hover:bg-zinc-200 dark:hover:bg-zinc-700
                                            transition-all
                                            font-medium
                                        "
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        onClick={createRole}
                                        className="
                                            h-11 px-5
                                            rounded-2xl
                                            bg-emerald-500
                                            hover:bg-emerald-400
                                            text-black
                                            font-semibold
                                            transition-all
                                            flex items-center gap-2
                                        "
                                    >
                                        <Plus size={16} />
                                        Criar Grupo
                                    </button>

                                </div>

                            </motion.div>

                        </motion.div>

                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
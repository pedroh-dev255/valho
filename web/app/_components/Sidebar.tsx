"use client";

import {
    LayoutDashboard,
    Wallet,
    Boxes,
    Settings,
    X,
    Sun,
    Moon,
    LogOut
} from "lucide-react";

import {
    useRouter,
    usePathname
} from "next/navigation";

import React from "react";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (value: boolean) => void;
}

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen
}: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [mounted, setMounted] = React.useState(false);
    const [isDarkMode, setIsDarkMode] = React.useState(true);

    React.useEffect(() => {
        setMounted(true);

        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "light") {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        }
    }, []);

    function toggleTheme() {
        const html = document.documentElement;

        if (isDarkMode) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    }

    async function handleLogout() {
        try {
            await fetch("/api/logout", {
                method: "POST"
            });

            router.replace("/login");
        } catch (err) {
            console.error("Erro ao fazer logout:", err);
        }
    }

    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            url: "/"
        },
        {
            label: "Financeiro",
            icon: Wallet,
            url: "/financeiro"
        },
        {
            label: "Estoque",
            icon: Boxes,
            url: "/estoque"
        },
        {
            label: "Configurações",
            icon: Settings,
            url: "/configuracoes"
        }
    ];

    if (!mounted) return null;

    return (
        <>
            {/* OVERLAY MOBILE */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 z-50
                    h-screen w-72
                    bg-white dark:bg-[#111113]
                    border-r border-zinc-200 dark:border-zinc-800
                    transition-transform duration-300
                    flex flex-col
                    ${sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* HEADER */}
                <div className="h-20 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            Valho
                        </h1>

                        <p className="text-sm text-zinc-500">
                            Financeiro & Estoque
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="
                                p-2 rounded-xl
                                hover:bg-zinc-100
                                dark:hover:bg-zinc-800
                                transition-all
                            "
                        >
                            {isDarkMode ? (
                                <Sun
                                    size={20}
                                    className="text-white"
                                />
                            ) : (
                                <Moon
                                    size={20}
                                    className="text-zinc-900"
                                />
                            )}
                        </button>

                        <button
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X
                                size={22}
                                className="text-zinc-900 dark:text-white"
                            />
                        </button>
                    </div>
                </div>

                {/* MENU */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        const isActive =
                            pathname === item.url;

                        return (
                            <button
                                key={item.label}
                                onClick={() => {
                                    router.push(item.url);
                                    setSidebarOpen(false);
                                }}
                                className={`
                                    w-full flex items-center gap-4
                                    px-4 py-3 rounded-2xl
                                    transition-all duration-200

                                    ${
                                        isActive
                                            ? `
                                                bg-emerald-500
                                                text-black
                                                shadow-lg
                                                shadow-emerald-500/20
                                            `
                                            : `
                                                text-zinc-700 dark:text-zinc-300
                                                hover:bg-zinc-100
                                                dark:hover:bg-zinc-800
                                            `
                                    }
                                `}
                            >
                                <Icon size={20} />

                                <span className="font-medium">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                {/* FOOTER */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="
                            w-full flex items-center gap-3
                            px-4 py-3 rounded-2xl
                            text-zinc-700 dark:text-zinc-300
                            hover:bg-zinc-100
                            dark:hover:bg-zinc-800
                            transition-all
                        "
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </aside>
        </>
    );
}
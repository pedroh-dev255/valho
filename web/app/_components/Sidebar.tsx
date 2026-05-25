"use client";

import {
    LayoutDashboard,
    Wallet,
    Boxes,
    Settings,
    X,
    Sun,
    Moon,
    LogOut,
    ChevronDown,
    Users,
    ShieldCheck,
    Mail,
    SlidersHorizontal,
    Activity
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

type IconType = React.ComponentType<
    React.SVGProps<SVGSVGElement> & { size?: number }
>;

interface MenuItem {
    label: string;
    icon: IconType;
    url: string;
    key?: string;
    children?: MenuItem[];
}

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen
}: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [mounted, setMounted] = React.useState(false);
    const [isDarkMode, setIsDarkMode] = React.useState(true);

    const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({
        configuracoes: false
    });

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

    function toggleMenu(menu: string) {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    }

    const getMenuKey = (item: MenuItem) => item.key ?? item.url;

    const itemContainsPath = (item: MenuItem, path: string): boolean =>
        item.url === path ||
        (item.children?.some((child) => itemContainsPath(child, path)) ?? false);

    React.useEffect(() => {
        setOpenMenus(() => {
            const next: Record<string, boolean> = {};

            const fillOpenState = (items: MenuItem[]) => {
                items.forEach((item) => {
                    if (!item.children?.length) return;

                    next[getMenuKey(item)] = itemContainsPath(item, pathname);
                    fillOpenState(item.children);
                });
            };

            fillOpenState(menuItems);
            return next;
        });
    }, [pathname]);

    const menuItems: MenuItem[] = [
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
            url: "/configuracoes",
            key: "configuracoes",

            children: [
                {
                    label: "Geral",
                    icon: SlidersHorizontal,
                    url: "/configuracoes"
                },
                {
                    label: "Atividades",
                    icon: Activity,
                    url: "/configuracoes/atividades"
                },
                {
                    label: "Usuários",
                    icon: Users,
                    url: "/configuracoes/usuarios",
                    children: [
                        {
                            label: "Todos os Usuários",
                            icon: Users,
                            url: "/configuracoes/usuarios"
                        },
                        {
                            label: "Convites Pendentes",
                            icon: Mail,
                            url: "/configuracoes/usuarios/convites"
                        },

                    ]
                },
                {
                    label: "Permissões",
                    icon: ShieldCheck,
                    url: "/configuracoes/permissoes"
                }
            ]
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
                        {/* 
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
                        */}
                    </div>
                </div>

                {/* MENU */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const menuKey = getMenuKey(item);
                        const children = item.children ?? [];
                        const hasChildren = children.length > 0;
                        const isActive = itemContainsPath(item, pathname);
                        const isMenuOpen = openMenus[menuKey] ?? false;

                        return (
                            <div
                                key={item.label}
                                className="space-y-2"
                            >
                                {/* ITEM PRINCIPAL */}
                                <button
                                    onClick={() => {
                                        if (hasChildren) {
                                            if (!isMenuOpen) {
                                                toggleMenu(menuKey);
                                            }

                                            router.push(children[0].url);
                                            setSidebarOpen(false);
                                            return;
                                        }

                                        router.push(item.url);
                                        setSidebarOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center justify-between
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
                                    <div className="flex items-center gap-4">
                                        <Icon size={20} />

                                        <span className="font-medium">
                                            {item.label}
                                        </span>
                                    </div>

                                    {hasChildren && (
                                        <ChevronDown
                                            size={18}
                                            className={`
                                                transition-transform
                                                ${
                                                    isMenuOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }
                                            `}
                                        />
                                    )}
                                </button>

                                {/* SUBMENU */}
                                {hasChildren &&
                                    isMenuOpen && (
                                        <div
                                            className="
                                                ml-4 pl-4
                                                border-l border-zinc-200
                                                dark:border-zinc-800
                                                space-y-1
                                            "
                                        >
                                            {children.map((child) => {
                                                const ChildIcon = child.icon;
                                                const childKey = getMenuKey(child);
                                                const childChildren = child.children ?? [];
                                                const childHasChildren =
                                                    childChildren.length > 0;
                                                const isChildActive =
                                                    itemContainsPath(
                                                        child,
                                                        pathname
                                                    );
                                                const isChildOpen =
                                                    openMenus[childKey] ?? false;

                                                return (
                                                    <div
                                                        key={child.label}
                                                        className="space-y-2"
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                if (
                                                                    childHasChildren
                                                                ) {
                                                                    if (!isChildOpen) {
                                                                        toggleMenu(
                                                                            childKey
                                                                        );
                                                                    }

                                                                    router.push(
                                                                        childChildren[0].url
                                                                    );
                                                                    setSidebarOpen(
                                                                        false
                                                                    );
                                                                    return;
                                                                }

                                                                router.push(child.url);
                                                                setSidebarOpen(
                                                                    false
                                                                );
                                                            }}
                                                            className={`
                                                                w-full flex items-center justify-between
                                                                gap-3
                                                                px-3 py-2.5 rounded-xl
                                                                text-sm
                                                                transition-all

                                                                ${
                                                                    isChildActive
                                                                        ? `
                                                                            bg-emerald-500/15
                                                                            text-emerald-500
                                                                        `
                                                                        : `
                                                                            text-zinc-600 dark:text-zinc-400
                                                                            hover:bg-zinc-100
                                                                            dark:hover:bg-zinc-800
                                                                        `
                                                                }
                                                            `}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <ChildIcon
                                                                    size={16}
                                                                />

                                                                <span>
                                                                    {child.label}
                                                                </span>
                                                            </div>

                                                            {childHasChildren && (
                                                                <ChevronDown
                                                                    size={16}
                                                                    className={`
                                                                        transition-transform
                                                                        ${
                                                                            isChildOpen
                                                                                ? "rotate-180"
                                                                                : ""
                                                                        }
                                                                    `}
                                                                />
                                                            )}
                                                        </button>

                                                        {childHasChildren &&
                                                            isChildOpen && (
                                                                <div
                                                                    className="
                                                                        ml-4 pl-4
                                                                        border-l border-zinc-200
                                                                        dark:border-zinc-800
                                                                        space-y-1
                                                                    "
                                                                >
                                                                    {childChildren.map(
                                                                        (
                                                                            grandchild
                                                                        ) => {
                                                                            const GrandchildIcon =
                                                                                grandchild.icon;
                                                                            const isGrandchildActive =
                                                                                pathname ===
                                                                                grandchild.url;

                                                                            return (
                                                                                <button
                                                                                    key={
                                                                                        grandchild.label
                                                                                    }
                                                                                    onClick={() => {
                                                                                        router.push(
                                                                                            grandchild.url
                                                                                        );
                                                                                        setSidebarOpen(
                                                                                            false
                                                                                        );
                                                                                    }}
                                                                                    className={`
                                                                                        w-full flex items-center gap-3
                                                                                        px-3 py-2.5 rounded-xl
                                                                                        text-sm
                                                                                        transition-all

                                                                                        ${
                                                                                            isGrandchildActive
                                                                                                ? `
                                                                                                    bg-emerald-500/15
                                                                                                    text-emerald-500
                                                                                                `
                                                                                                : `
                                                                                                    text-zinc-600 dark:text-zinc-400
                                                                                                    hover:bg-zinc-100
                                                                                                    dark:hover:bg-zinc-800
                                                                                                `
                                                                                        }
                                                                                    `}
                                                                                >
                                                                                    <GrandchildIcon
                                                                                        size={16}
                                                                                    />

                                                                                    <span>
                                                                                        {grandchild.label}
                                                                                    </span>
                                                                                </button>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                            </div>
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
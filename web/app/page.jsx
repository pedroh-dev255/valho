"use client";

import { useEffect, useState } from "react";

import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  PackageSearch,
  Clock3,
  Menu,
  Search
} from "lucide-react";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

import Sidebar from "./_components/Sidebar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [cards, setCards] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [activities, setActivities] = useState([]);

  async function fetchData(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/data/home', {
        method: 'GET'
      });

      if(res.status === 403) {
        setHasPermission(false);
        setLoading(false);
        toast.error(res.message || 'Acesso negado');
        return;
      }

      const data = await res.json();

      setHasPermission(true);

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Erro ao carregar dados');
        setLoading(false);
        return;
      }

      //data.cards, data.stockAlerts, data.activities
      setCards(data.data?.cards);
      setStockAlerts(data.data?.stockAlerts);
      setActivities(data.data?.activities);

      toast.success('Dados carregados com sucesso!');
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const init = async () => {
      await fetchData(new Event("fetch"));
    };
    init();
  }, []);

  const icons = {
    Wallet,
    ArrowDownCircle,
    ArrowUpCircle,
    AlertTriangle,
    PackageSearch,
    Clock3,
    Menu,
    Search
  };

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
        duration: 0.45,
        ease: "easeOut"
      }
    }
  };

  const slideLeft = {
    hidden: {
      opacity: 0,
      x: -30
    },

    show: {
      opacity: 1,
      x: 0,

      transition: {
        duration: 0.5
      }
    }
  };

  const slideRight = {
    hidden: {
      opacity: 0,
      x: 30
    },

    show: {
      opacity: 1,
      x: 0,

      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-[#09090B] text-zinc-900 dark:text-white overflow-hidden">
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
              <div className="lg:hidden w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />

              <div className="space-y-2">
                <div className="w-40 h-6 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />

                <div className="w-56 h-4 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              </div>
            </div>

            <div
              className="
                hidden md:flex
                w-80 h-12 rounded-2xl
                bg-zinc-200 dark:bg-zinc-800
                animate-pulse
              "
            />
          </header>

          {/* CONTENT */}
          <main className="flex-1 p-4 lg:p-8 space-y-8">
            {/* TOP CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="
                    relative overflow-hidden
                    h-40 rounded-3xl
                    border border-zinc-200 dark:border-zinc-800
                    bg-white dark:bg-[#111113]
                  "
                >
                  <div
                    className="
                      absolute inset-0
                      -translate-x-full
                      animate-[shimmer_2s_infinite]
                      bg-gradient-to-r
                      from-transparent
                      via-white/10
                      to-transparent
                    "
                  />

                  <div className="p-6">
                    <div className="w-24 h-4 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-6" />

                    <div className="w-36 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-4" />

                    <div className="w-28 h-4 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-6">
              {/* CHART */}
              <div
                className="
                  relative overflow-hidden
                  h-[420px]
                  rounded-3xl
                  border border-zinc-200 dark:border-zinc-800
                  bg-white dark:bg-[#111113]
                  p-6
                "
              >
                <div
                  className="
                    absolute inset-0
                    -translate-x-full
                    animate-[shimmer_2s_infinite]
                    bg-gradient-to-r
                    from-transparent
                    via-white/10
                    to-transparent
                  "
                />

                <div className="w-40 h-6 rounded-xl bg-zinc-200 dark:bg-zinc-800 mb-3" />

                <div className="w-28 h-4 rounded-xl bg-zinc-200 dark:bg-zinc-800 mb-10" />

                <div className="flex items-end gap-3 h-64">
                  {[40, 75, 55, 90, 65, 85, 50].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-3xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"
                      style={{
                        height: `${height}%`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* SIDE */}
              <div
                className="
                  relative overflow-hidden
                  h-[420px]
                  rounded-3xl
                  border border-zinc-200 dark:border-zinc-800
                  bg-white dark:bg-[#111113]
                  p-6
                "
              >
                <div
                  className="
                    absolute inset-0
                    -translate-x-full
                    animate-[shimmer_2s_infinite]
                    bg-gradient-to-r
                    from-transparent
                    via-white/10
                    to-transparent
                  "
                />

                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="
                        h-24 rounded-2xl
                        bg-zinc-100 dark:bg-zinc-900
                        border border-zinc-200 dark:border-zinc-800
                      "
                    />
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold tracking-tight">
                Dashboard
              </h2>

              <p className="text-sm text-zinc-500 mt-1">
                Controle financeiro e estoque
              </p>
            </motion.div>
          </div>

          {/* SEARCH */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="
              hidden md:flex items-center gap-3
              bg-white dark:bg-[#111113]
              border border-zinc-200 dark:border-zinc-800
              rounded-2xl px-4
              h-12 w-80
            "
          >
            <Search
              size={18}
              className="text-zinc-500"
            />

            <input
              type="text"
              placeholder="Buscar movimentações..."
              className="
                bg-transparent outline-none w-full
                text-sm
                placeholder:text-zinc-500
              "
            />
          </motion.div>
        </header>

        {/* CONTENT */}
        <motion.main
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 p-4 lg:p-8 space-y-8 pb-28 lg:pb-8"
        >
          {/* CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card) => {
              const Icon = icons[card.icon] || Wallet;

              return (
                <motion.div
                  variants={item}
                  whileHover={{
                    y: -4,
                    scale: 1.01
                  }}
                  key={card.title}
                  className="
                    bg-white dark:bg-[#111113]
                    border border-zinc-200 dark:border-zinc-800
                    rounded-3xl p-6
                    hover:border-emerald-500/40
                    transition-all
                  "
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-zinc-500 text-sm">
                        {card.title}
                      </p>

                      <h3 className="text-3xl font-bold mt-4 tracking-tight">
                        {card.value}
                      </h3>

                      <p className="text-sm text-emerald-500 mt-3">
                        {card.subtitle}
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
                      <Icon size={22} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </section>

          {/* FLUXO + ESTOQUE */}
          <section className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-6">
            {/* FLUXO */}
            <motion.div
              variants={slideLeft}
              className="
                bg-white dark:bg-[#111113]
                border border-zinc-200 dark:border-zinc-800
                rounded-3xl p-6
              "
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    Fluxo de Caixa
                  </h3>

                  <p className="text-sm text-zinc-500 mt-1">
                    Últimos 7 dias
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="
                    bg-emerald-500 text-black
                    px-4 h-11 rounded-2xl
                    font-semibold
                  "
                >
                  Ver Relatório
                </motion.button>
              </div>

              <div className="h-72 flex items-end gap-3">
                {[45, 80, 35, 70, 55, 95, 65].map(
                  (value, index) => (
                    <motion.div
                      key={index}
                      initial={{
                        height: 0,
                        opacity: 0
                      }}
                      animate={{
                        height: "100%",
                        opacity: 1
                      }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.5
                      }}
                      className="flex-1 flex flex-col items-center gap-3"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{
                          height: `${value}%`
                        }}
                        transition={{
                          delay: index * 0.08,
                          duration: 0.7
                        }}
                        className="
                          w-full rounded-3xl
                          bg-gradient-to-t
                          from-emerald-500
                          to-emerald-400
                        "
                      />

                      <span className="text-xs text-zinc-500">
                        {
                          [
                            "SEG",
                            "TER",
                            "QUA",
                            "QUI",
                            "SEX",
                            "SAB",
                            "DOM"
                          ][index]
                        }
                      </span>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>

            {/* ESTOQUE */}
            <motion.div
              variants={slideRight}
              className="
                bg-white dark:bg-[#111113]
                border border-zinc-200 dark:border-zinc-800
                rounded-3xl p-6
              "
            >
              <div className="flex items-center gap-3 mb-6">
                <PackageSearch
                  className="text-emerald-500"
                  size={22}
                />

                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    Estoque Crítico
                  </h3>

                  <p className="text-sm text-zinc-500 mt-1">
                    Produtos abaixo do mínimo
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {stockAlerts.map((item, index) => (
                  <motion.div
                    key={item.product}
                    initial={{
                      opacity: 0,
                      x: 20
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    transition={{
                      delay: index * 0.1
                    }}
                    className="
                      bg-zinc-50 dark:bg-[#09090B]
                      border border-zinc-200 dark:border-zinc-800
                      rounded-2xl p-4
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold tracking-tight">
                          {item.product}
                        </h4>

                        <p className="text-sm text-zinc-500 mt-1">
                          Atual: {item.stock} • Mínimo: {item.min}
                        </p>
                      </div>

                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2
                        }}
                        className={`w-3 h-3 rounded-full ${
                          item.severity === "critical"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ATIVIDADES */}
          <section className="grid grid-cols-1 xl:grid-cols-[1fr_0.5fr] gap-6">
            {/* RECENTES */}
            <motion.div
              variants={item}
              className="
                bg-white dark:bg-[#111113]
                border border-zinc-200 dark:border-zinc-800
                rounded-3xl p-6
              "
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock3
                  className="text-emerald-500"
                  size={20}
                />

                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    Atividade Recente
                  </h3>

                  <p className="text-sm text-zinc-500 mt-1">
                    Últimas movimentações do sistema
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {activities.map((activity, index) => (
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
                      delay: index * 0.08
                    }}
                    className="
                      flex items-center gap-4
                      p-4 rounded-2xl
                      bg-zinc-50 dark:bg-[#09090B]
                      border border-zinc-200 dark:border-zinc-800
                    "
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />

                    <span className="text-sm">
                      {activity}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AÇÕES */}
            <motion.div
              variants={item}
              className="
                bg-white dark:bg-[#111113]
                border border-zinc-200 dark:border-zinc-800
                rounded-3xl p-6
              "
            >
              <h3 className="text-xl font-semibold tracking-tight mb-6">
                Ações Rápidas
              </h3>

              <div className="grid gap-3">
                {[
                  "Nova Receita",
                  "Nova Despesa",
                  "Entrada Estoque",
                  "Ajustar Inventário"
                ].map((button, index) => (
                  <motion.button
                    key={button}
                    whileHover={{
                      scale: 1.02
                    }}
                    whileTap={{
                      scale: 0.98
                    }}
                    initial={{
                      opacity: 0,
                      y: 15
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    transition={{
                      delay: index * 0.08
                    }}
                    className={`
                      h-14 rounded-2xl
                      transition-all font-medium

                      ${
                        index === 0
                          ? "bg-emerald-500 text-black font-semibold"
                          : `
                            bg-zinc-200 dark:bg-zinc-800
                            hover:bg-zinc-300 dark:hover:bg-zinc-700
                          `
                      }
                    `}
                  >
                    {button}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </section>
        </motion.main>
      </div>
    </div>
  );
}
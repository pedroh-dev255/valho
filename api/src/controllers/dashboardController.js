const dashService = require('../services/dashService');

async function getHomeData(req, res) {
  try {
    const institutionId = req.user.institution_id;
    const userId = req.user.id;


    const data = await dashService.getDashboardData(userId, institutionId);
    const cards = [
      {
        title: "Saldo Atual",
        value: "R$ 42.820,22",
        subtitle: "+12% esse mês",
        icon: "Wallet",
      },

      {
        title: "Receitas do Mês",
        value: "R$ 98.420,00",
        subtitle: "124 recebimentos",
        icon: "ArrowDownCircle",
      },
      {
        title: "Despesas do Mês",
        value: "R$ 55.599,78",
        subtitle: "89 pagamentos",
        icon: "ArrowUpCircle",
      },
      {
        title: "Itens em Falta",
        value: "8",
        subtitle: "2 críticos",
        icon: "AlertTriangle",
      },
    ];

    const stockAlerts = [
      {
        product: "Arroz 5kg",
        stock: 2,
        min: 10,
        severity: "critical",
      },
      {
        product: "Leite Integral",
        stock: 6,
        min: 15,
        severity: "warning",
      },
      {
        product: "Café Premium",
        stock: 4,
        min: 12,
        severity: "critical",
      },
    ];


    return res.status(200).json({
      success: true,
      message: "Dados do dashboard obtidos com sucesso",
      data: {
        cards,
        stockAlerts,
        activities: data.activities,

      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao obter dados do dashboard",
      error: error.message,
    });
  }
}

module.exports = {
  getHomeData,
};

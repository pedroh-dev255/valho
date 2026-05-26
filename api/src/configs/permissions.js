module.exports = [

    // ========================= DASHBOARD =========================
    {
        key: 'dashboard.view',
        description: 'Visualizar dashboard'
    },

    // ========================= ESTOQUE =========================
    {
        key: 'inventory.view',
        description: 'Visualizar estoque'
    },
    {
        key: 'inventory.add',
        description: 'Adicionar itens ao estoque'
    },
    {
        key: 'inventory.remove',
        description: 'Remover itens do estoque'
    },
    {
        key: 'inventory.edit',
        description: 'Editar itens do estoque'
    },

    // NOVAS PERMISSÕES DE ESTOQUE

    {
        key: 'inventory.products.view',
        description: 'Visualizar produtos'
    },
    {
        key: 'inventory.products.add',
        description: 'Cadastrar produtos'
    },
    {
        key: 'inventory.products.edit',
        description: 'Editar produtos'
    },
    {
        key: 'inventory.products.delete',
        description: 'Excluir produtos'
    },

    {
        key: 'inventory.categories.view',
        description: 'Visualizar categorias de estoque'
    },
    {
        key: 'inventory.categories.add',
        description: 'Cadastrar categorias de estoque'
    },
    {
        key: 'inventory.categories.edit',
        description: 'Editar categorias de estoque'
    },
    {
        key: 'inventory.categories.delete',
        description: 'Excluir categorias de estoque'
    },

    {
        key: 'inventory.suppliers.view',
        description: 'Visualizar fornecedores'
    },
    {
        key: 'inventory.suppliers.add',
        description: 'Cadastrar fornecedores'
    },
    {
        key: 'inventory.suppliers.edit',
        description: 'Editar fornecedores'
    },
    {
        key: 'inventory.suppliers.delete',
        description: 'Excluir fornecedores'
    },

    {
        key: 'inventory.movements.view',
        description: 'Visualizar movimentações de estoque'
    },
    {
        key: 'inventory.movements.add',
        description: 'Registrar movimentações de estoque'
    },

    {
        key: 'inventory.adjustments.view',
        description: 'Visualizar ajustes de inventário'
    },
    {
        key: 'inventory.adjustments.add',
        description: 'Criar ajustes de inventário'
    },
    {
        key: 'inventory.adjustments.approve',
        description: 'Aprovar ajustes de inventário'
    },

    {
        key: 'inventory.transfers.view',
        description: 'Visualizar transferências de estoque'
    },
    {
        key: 'inventory.transfers.add',
        description: 'Criar transferências de estoque'
    },
    {
        key: 'inventory.transfers.approve',
        description: 'Aprovar transferências de estoque'
    },

    {
        key: 'inventory.purchase_orders.view',
        description: 'Visualizar pedidos de compra'
    },
    {
        key: 'inventory.purchase_orders.add',
        description: 'Criar pedidos de compra'
    },
    {
        key: 'inventory.purchase_orders.edit',
        description: 'Editar pedidos de compra'
    },
    {
        key: 'inventory.purchase_orders.delete',
        description: 'Excluir pedidos de compra'
    },
    {
        key: 'inventory.purchase_orders.receive',
        description: 'Receber mercadorias no estoque'
    },

    {
        key: 'inventory.locations.view',
        description: 'Visualizar depósitos e locais'
    },
    {
        key: 'inventory.locations.add',
        description: 'Cadastrar depósitos e locais'
    },
    {
        key: 'inventory.locations.edit',
        description: 'Editar depósitos e locais'
    },
    {
        key: 'inventory.locations.delete',
        description: 'Excluir depósitos e locais'
    },

    {
        key: 'inventory.costs.view',
        description: 'Visualizar custos dos produtos'
    },
    {
        key: 'inventory.costs.edit',
        description: 'Editar custos dos produtos'
    },

    {
        key: 'inventory.reports.view',
        description: 'Visualizar relatórios de estoque'
    },
    {
        key: 'inventory.reports.generate',
        description: 'Gerar relatórios de estoque'
    },

    // ========================= RELATÓRIOS =========================
    {
        key: 'reports.view',
        description: 'Visualizar relatórios'
    },
    {
        key: 'reports.generate',
        description: 'Gerar relatórios'
    },

    // ========================= TRANSAÇÕES DE SAÍDA =========================
    {
        key: 'out_transactions.view',
        description: 'Visualizar lançamentos'
    },
    {
        key: 'out_transactions.add',
        description: 'Adicionar lançamentos'
    },
    {
        key: 'out_transactions.edit',
        description: 'Editar lançamentos'
    },
    {
        key: 'out_transactions.delete',
        description: 'Excluir lançamentos'
    },

    // ========================= TRANSAÇÕES DE ENTRADA =========================
    {
        key: 'in_transactions.view',
        description: 'Visualizar entradas'
    },
    {
        key: 'in_transactions.add',
        description: 'Adicionar entradas'
    },
    {
        key: 'in_transactions.edit',
        description: 'Editar entradas'
    },
    {
        key: 'in_transactions.delete',
        description: 'Excluir entradas'
    },

    // ========================= CONFIG =========================
    {
        key: 'config.view',
        description: 'Visualizar página de configurações do sistema'
    },
    {
        key: 'config.edit',
        description: 'Editar configurações do sistema'
    },

    // ========================= ATIVIDADES =========================
    {
        key: 'activities.view',
        description: 'Visualizar atividades recentes do sistema'
    },

    // ========================= USUÁRIOS =========================
    {
        key: 'users.view',
        description: 'Visualizar usuários'
    },
    {
        key: 'users.invite',
        description: 'Enviar convites para novos usuários'
    },
    {
        key: 'users.edit',
        description: 'Editar usuários'
    },
    {
        key: 'users.delete',
        description: 'Excluir usuários'
    },

    // ========================= ROLES =========================
    {
        key: 'roles.view',
        description: 'Visualizar cargos'
    },
    {
        key: 'roles.add',
        description: 'Adicionar cargos'
    },
    {
        key: 'roles.edit',
        description: 'Editar cargos'
    },
    {
        key: 'roles.delete',
        description: 'Excluir cargos'
    },

    // ========================= PERMISSIONS =========================
    {
        key: 'permissions.view',
        description: 'Visualizar permissões'
    },
    {
        key: 'permissions.edit',
        description: 'Editar permissões'
    },

    // ========================= ATRIBUIR ROLES =========================
    {
        key: 'assign_roles.view',
        description: 'Visualizar atribuições de cargos'
    },
    {
        key: 'assign_roles.add',
        description: 'Atribuir cargos a usuários'
    },
    {
        key: 'assign_roles.delete',
        description: 'Excluir atribuições de cargos'
    },
];
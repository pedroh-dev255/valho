const activitiesService = require('../services/activitiesService');

async function getConfigData(req, res) {
    try {
        const data = {
            // Example configuration data - replace with actual config values
            theme: 'dark',
            language: 'pt-BR',
            notifications: true
        };

        return res.status(200).json({
            success: true,
            message: 'Dados de configuração obtidos com sucesso',
            data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao obter dados de configuração',
            error: error.message
        });
    }
}

async function getActivities(req, res) {
    try {
        const { search, page } = req.query;
        const institutionId = req.user.institution_id;
        console.log(`getActivities called with institutionId=${institutionId}, search=${search}, page=${page}`);
        const activities = await activitiesService.getActivities(institutionId, search, page);

        return res.status(200).json({
            success: true,
            message: 'Atividades recentes obtidas com sucesso',
            activities
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao obter atividades recentes',
            error: error.message
        });
    }
}

module.exports = {
    getConfigData,
    getActivities
};
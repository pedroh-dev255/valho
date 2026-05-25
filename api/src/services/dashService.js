const pool = require('../configs/db');


async function getDashboardData(institutionId, userId) {
    try {
        const [activities] = await pool.query(`SELECT a.id, a.action, a.created_at, u.name as user_name, a.details as details, a.level as level FROM audit_logs a JOIN users u ON a.user_id = u.id WHERE a.id_institution = ? ORDER BY a.created_at DESC LIMIT 3`, [institutionId]);
        for (let activity of activities) {
            if (activity.action === 'create_invite') {
                activity.details = `Usuario ${activity.user_name} enviou um convite para ${activity.details}`;
            } else if (activity.action === 'register') {
                activity.details = `${activity.user_name} se registrou com o email ${activity.details}`;
            } else if (activity.action === 'delete_invite') {
                activity.details = `Convite com ID ${activity.details} foi deletado por ${activity.user_name}`;
            }
        }

        // console.log('Atividades recentes:', activities);

        return {
            activities
        }
        
    } catch (error) {
        throw new Error('Erro ao obter dados do dashboard: ' + error.message);
    }
}

module.exports = {
    getDashboardData
};
const pool = require('../configs/db');
const {formatActivities} = require('./activitiesService');

async function getDashboardData(institutionId, userId) {
    try {
        let [activities] = await pool.query(`SELECT a.id, a.action, a.created_at, u.name as user_name, u.id as user_id, a.details as details, a.level as level FROM audit_logs a JOIN users u ON a.user_id = u.id WHERE a.id_institution = ? ORDER BY a.created_at DESC LIMIT 3`, [institutionId]);
        
        // Formata Atividades
        activities = formatActivities(activities);

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
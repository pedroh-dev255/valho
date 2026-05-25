const pool = require('../configs/db');

async function getActivities(
    institutionId,
    search = '',
    page = 1
) {
    try {
        const limit = 10;

        page = Number(page) || 1;

        const offset =
            (page - 1) * limit;

        let where =
            `WHERE a.id_institution = ?`;

        const params = [institutionId];

        if (
            search &&
            search.trim() !== ''
        ) {

            where += `
                AND (
                    u.name LIKE ?
                    OR a.details LIKE ?
                )
            `;

            params.push(
                `%${search}%`,
                `%${search}%`
            );
        }

        // TOTAL
        const countQuery = `
            SELECT COUNT(*) as total
            FROM audit_logs a
            JOIN users u
                ON a.user_id = u.id
            ${where}
        `;

        const [countRows] =
            await pool.query(
                countQuery,
                params
            );

        const total =
            countRows[0]?.total || 0;

        const totalPages =
            Math.ceil(total / limit);

        // DATA
        const dataQuery = `
            SELECT
                a.id,
                a.action,
                a.created_at,
                a.details,
                a.level,
                u.name as user_name
            FROM audit_logs a
            JOIN users u
                ON a.user_id = u.id
            ${where}
            ORDER BY a.created_at DESC
            LIMIT ?
            OFFSET ?
        `;

        const [activities] =
            await pool.query(
                dataQuery,
                [
                    ...params,
                    limit,
                    offset
                ]
            );

        // FORMAT DETAILS
        for (const activity of activities) {

            switch (activity.action) {

                case 'create_invite':

                    activity.details =
                        `Usuário ${activity.user_name} enviou um convite para ${activity.details}`;

                    break;

                case 'register':

                    activity.details =
                        `${activity.user_name} se registrou com o email ${activity.details}`;

                    break;

                case 'delete_invite':

                    activity.details =
                        `Convite ${activity.details} foi deletado por ${activity.user_name}`;

                    break;

                default:

                    activity.details =
                        activity.details ||
                        'Atividade registrada';

                    break;
            }
        }

        return {
            activities,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };

    } catch (error) {

        console.error(
            'getActivities error:',
            error
        );

        throw new Error(
            'Erro ao obter atividades'
        );
    }
}

module.exports = {
    getActivities
};
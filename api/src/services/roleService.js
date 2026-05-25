const pool = require('../configs/db');


async function getRoles(institutionId) {
    const [rows] = await pool.execute(
        'SELECT * FROM roles WHERE institution_id = ?',
        [institutionId]
    );
    return rows;
}

module.exports = {
    getRoles
};
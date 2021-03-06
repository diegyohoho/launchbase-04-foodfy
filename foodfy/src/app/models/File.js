const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create(data) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            data.filename,
            data.path
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query(`
            SELECT *
            FROM files
            WHERE id = $1`, [id])
    },
    async update(data) {
        try {
            const file = (await db.query(`SELECT * FROM files WHERE id = $1`, [data.id])).rows[0]
            console.log(file)
            fs.unlinkSync(file.path)

            const query = `
                UPDATE files SET
                    name=($1),
                    path=($2)
                WHERE id = $3
            `

            const values = [
                data.filename,
                data.path,
                data.id
            ]

            return db.query(query, values)
        } catch(err) {
            throw new Error(err)
        }
    },
    async delete(id) {

        try {
            const file = (await db.query(`SELECT * FROM files WHERE id = $1`, [id])).rows[0]

            fs.unlinkSync(file.path)

            return db.query(`
                DELETE FROM files
                WHERE id = $1
            `, [id])
        } catch(err) {
            throw new Error(err)
        }
    }
}
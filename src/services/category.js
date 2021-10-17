module.exports = (db) => {
    return {
        async getCategories() {
            let sql = ''

            sql = "select `id`, `name`,`created_at` as `createdAt` from `categories`"

            let [categories] = await db.query(
                sql
            )

            return categories
        }
    }
}

module.exports = (db) => {
    return {
        async getReplies(articleId, page = 1, limit = 5) {
            let sql = ''
            let preparedValues = []
            let where = ''

            where = ' where `article_id`=?'

            sql = "select count(`id`) as `count` from `replies`" + where
            preparedValues = [articleId]
            let [[{count}]] = await db.query(sql, preparedValues)

            // 计算总页数
            let pages = Math.ceil(count / limit)
            pages = Math.max(pages, 1)
            page = Math.max(page, 1)
            page = Math.min(page, pages)
            let offset = (page - 1) * limit

            sql = "select `replies`.`id` as `id`, `replies`.`article_id` as `articleId`, `replies`.`user_id` as `userId`, `replies`.`content`, `replies`.`created_at` as `createdAt`, `users`.`username`, `users`.`avatar` from `replies` left join `users` on `replies`.`user_id` = `users`.`id` " + where + " order by `replies`.`created_at` desc limit ? offset ?"
            preparedValues = [...preparedValues, limit, offset]
            let [replies] = await db.query(sql, preparedValues)

            return {
                page,
                limit,
                count,
                pages,
                replies
            }
        },

        async postReply(insertData) {
            let {articleId, content, userId } = insertData

            let sql = ''
            let preparedValues = []
            let createdAt = Date.now()
            sql = "insert into `replies` (`article_id`,`user_id`, `content`, `created_at`) values (?,?,?,?)"
            preparedValues = [articleId, userId, content, createdAt]
            let [{insertId: replyId}] = await db.query(sql, preparedValues)

            // 更新文章的评论次数
            sql = "select `id`, `reply_count` as `replyCount` from `articles` where `id`=?"
            preparedValues= [articleId]
            let [[article]] = await db.query(sql, preparedValues)

            let articleReplyCount = article.replyCount + 1
            sql = "update `articles` set `reply_count`=? where `id`=?"
            preparedValues = [articleReplyCount, articleId]
            let [{affectedRows}] = await  db.query(sql, preparedValues)

            return {
                id: replyId,
                userId,
                content,
                createdAt
            }
        }
    }
}

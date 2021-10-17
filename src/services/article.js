module.exports = (db) => {
    return {
        async getArticles(categoryId, page = 1, limit = 5) {
            let sql = ''
            let preparedValues = []
            let where = ''

            // 查询指定分类的文章
            if (categoryId) {
                where = ' where `category_id` = ?'
                preparedValues = [categoryId]
            }

            // 查询文章总数
            sql = "select count(`id`) as count from `articles`" + where
            let [[{count}]] = await db.query(
                sql,
                preparedValues
            )

            // 计算总页数
            let pages = Math.ceil(count / limit)
            page = Math.max(1, page)
            page = Math.min(page, pages)
            let offset = (page - 1) * limit

            sql = "select `articles`.`id`, `articles`.`title`,`articles`.`category_id` as `categoryId`, `articles`.`user_id` as `userId`, `articles`.`view_count` as `viewCount`, `articles`.`reply_count` as `replyCount`, `articles`.`created_at` as `createdAt`, `users`.`username`, `users`.`avatar` from `articles` left join `users` on `articles`.`user_id`=`users`.`id` " + where + " order by `articles`.`created_at` desc limit ? offset ?"
            preparedValues = [...preparedValues, limit, offset]
            let [articles] = await db.query(sql, preparedValues)

            return {
                page,
                limit,
                count,
                pages,
                articles
            }
        },

        async getArticle(id) {
            let sql = ''
            let preparedValues = []

            sql = "select `articles`.`id`, `articles`.`title`,`articles`.`category_id` as `categoryId`, `articles`.`user_id` as `userId`, `articles`.`view_count` as `viewCount`, `articles`.`reply_count` as `replyCount`, `articles`.`created_at` as `createdAt`, `users`.`username`, `users`.`avatar` from `articles` left join `users` on `articles`.`user_id`=`users`.`id` where `articles`.`id`=?"
            preparedValues = [id]

            let [[article]] = await db.query(sql, preparedValues)

            if (!article) {
                return null
            }

            // 查询文章的内容
            sql = "select `content` from `article_contents` where `article_id`=?"
            let [[articleContent]] = await db.query(sql, preparedValues)

            return {
                ...article,
                content: articleContent ? articleContent.content : ''
            }
        },

        async postArticle(insertData) {
            let {categoryId, title, content, userId} = insertData

            let sql = ''
            let preparedValues = []

            // 保存文章的基本信息
            sql = "insert into `articles` (`category_id`, `title`, `user_id`, `created_at`) values (?, ?, ?, ?)"
            let createdAt = Date.now()
            preparedValues = [categoryId, title, userId, createdAt]
            let [{insertId: articleId}] = await db.query(sql, preparedValues)

            // 保存文章的内容
            sql = "insert into `article_contents` (`article_id`, `content`) values (?,?)"
            preparedValues = [articleId, content]
            let [{articleContentId}] = await db.query(sql, preparedValues)

            return {
                id: articleId,
                categoryId,
                title,
                content,
                userId,
                createdAt
            }
        },

        async patchArticleViewCount(id) {
            let sql = ''
            let preparedValues = []

            sql = "select `id`,`view_count` as `viewCount` from `articles` where `id` = ?"
            preparedValues = [id]
            let [[article]] = await db.query(sql, preparedValues)

            // 更新
            let viewCount = article.viewCount + 1
            sql = "update `articles` set `view_count` = ? where `id`=?"
            preparedValues.unshift(viewCount)
            let [{affectedRows}] = await db.query(sql, preparedValues)

            return affectedRows > 0 ? viewCount : 0
        }
    }
}

module.exports = () => {
    return async (ctx, next) => {
        /**
         * { code: 0 message: '', results: 数据 }
         * { code: 具体错误码, message: 错误描述, errors: 错误原因 }
         */
        try {
            await next()

            ctx.body = {
                code: 0,
                message: '',
                results: ctx.body
            }
        } catch (err) {
            ctx.status = err.status || 500

            ctx.body = {
                code: err.code,
                message: err.message,
                errors: err.errors
            }

            ctx.app.emit('error', err, ctx)
        }
    }
}

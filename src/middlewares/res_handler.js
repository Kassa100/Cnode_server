module.exports = () => {
  return async (ctx, next) => {
    /*
            {code:业务错误代码,message:业务错误描述,data:数据，errors:错误原因 }
        */
    try {
      await next();
      ctx.body = {
        code: 0,
        message: "",
        data: ctx.body,
      };
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = {
        code: err.code,
        message: err.message,
        errors: err.errors,
      };

      ctx.app.emit("error", err, ctx);
    }
  };
};

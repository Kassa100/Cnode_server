module.exports = {
  async getAllArticles(ctx, next) {
    let { categoryId, page, limit } = ctx.request.query;

    categoryId = Number(categoryId);
    page = Number(page) || 1;
    limit = Number(limit) || 5;

    const articleService = ctx.state.services.article;
    console.log(ctx.state.services);
    ctx.body = await articleService.getAllArticles(categoryId, page, limit);
  },
  async postArticle() {},
  async patchArticleViewCount() {},
  async getArticle(ctx, next) {
    let id = Number(ctx.request.params.id);
    console.log(id);
    const articleService = ctx.state.services.article;

    let article = await articleService.getArticle(id);
    if (!article) {
      ctx.throw(404, {
        code: 3011,
        message: "文章不存在",
      });
    }
    ctx.body = article;
  },
};

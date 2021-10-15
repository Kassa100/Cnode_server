module.exports = {
  async getCategoies(ctx, next) {
    console.log(ctx.state.services);
    let categoryService = ctx.state.services.category;

    let categories = await categoryService.getCategoies();
    ctx.body = categories;
  },
};

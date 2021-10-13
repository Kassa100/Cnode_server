const koaBody = require("koa-body");
const auth = require("../middlewares/auth");
const config = require("../configs");
const mainController = require("../controllers/main");
const authController = require("../controllers/auth");
const replyController = require("../controllers/reply");
const userController = require("../controllers/user");
const categoryController = require("../controllers/category");
const acticleController = require("../controllers/acticle");

const routes = [
  {
    method: "get",
    url: "/",
    middlewares: [mainController.main],
  },
  {
    method: "post",
    url: "/auth/register",
    middlewares: [koaBody(), authController.register],
  },
  {
    method: "post",
    url: "/auth/login",
    middlewares: [koaBody(), authController.login],
  },
  {
    method: "get",
    url: "/user/getProfile",
    middlewares: [userController.getProfile],
  },
  {
    method: "patch",
    url: "/user/patchAvatar",
    middlewares: [
      auth(),
      koaBody({
        multipart: true,
        formidable: {
          uploadDir: config.upload.dir,
          keepExtensions: true,
        },
      }),
      userController.patchAvatar,
    ],
  },
  {
    method: "get",
    url: "/user/getArticles",
    middlewares: [userController.getArticles],
  },
  {
    method: "get",
    url: "/user/getReplies",
    middlewares: [userController.getReplies],
  },
  {
    method: "get",
    url: "/getCategoies",
    middlewares: [categoryController.getCategoies],
  },
  {
    method: "get",
    url: "/acticle/getAllActicles",
    middlewares: [acticleController.getAllActicles],
  },
  {
    method: "get",
    url: "/acticle/getArticle:id(\\d+)",
    middlewares: [acticleController.getArticle],
  },
  {
    method: "post",
    url: "/acticle/postArticle",
    middlewares: [auth(), koaBody(), acticleController.postArticle],
  },
  {
    method: "patch",
    url: "/user/patchArticleViewCount:id(\\d+)/view_count",
    middlewares: [acticleController.patchArticleViewCount],
  },
  {
    method: "get",
    url: "/reply/getReplies",
    middlewares: [replyController.getReplies],
  },
  {
    method: "post",
    url: "/reply/postReply",
    middlewares: [auth(), koaBody(), replyController.getReplies],
  },
];

module.exports = {
  routes,
};

const koaBody = require('koa-body')
const auth = require('../middlewares/auth')
const configs = require('../configs')

const mainController = require('../controllers/main')
const authController = require('../controllers/auth')
const userController = require('../controllers/user')
const categoryController = require('../controllers/category')
const articleController = require('../controllers/article')
const replyController = require('../controllers/reply')

const routes = [
    {
        method: 'get',
        url: '/',
        middlewares: [
            mainController.main
        ]
    },

    {
        method: 'post',
        url: '/auth/register',
        middlewares: [
            koaBody(),
            authController.register
        ]
    },

    {
        method: 'post',
        url: '/auth/login',
        middlewares: [
            koaBody(),
            authController.login
        ]
    },

    {
        method: 'get',
        url: '/user/profile',
        middlewares: [
            userController.getProfile
        ]
    },

    {
        method: 'patch',
        url: '/user/avatar',
        middlewares: [
            auth(),
            koaBody({
                multipart: true,
                formidable: {
                    uploadDir: configs.upload.dir,
                    keepExtensions: true
                }
            }),
            userController.patchAvatar
        ]
    },

    {
        method: 'get',
        url: '/user/articles',
        middlewares: [
            userController.getArticles
        ]
    },

    {
        method: 'get',
        url: '/user/replies',
        middlewares: [
            userController.getReplies
        ]
    },

    {
        method: 'get',
        url: '/categories',
        middlewares: [
            categoryController.getCategories
        ]
    },

    {
        method: 'get',
        url: '/articles',
        middlewares: [
            articleController.getArticles
        ]
    },

    {
        method: 'get',
        url: '/article/:id(\\d+)',
        middlewares: [
            articleController.getArticle
        ]
    },

    {
        method: 'post',
        url: '/article',
        middlewares: [
            auth(),
            koaBody(),
            articleController.postArticle
        ]
    },

    {
        method: 'patch',
        url: '/article/:id(\\d+)/view_count',
        middlewares: [
            articleController.patchArticleViewCount
        ]
    },

    {
        method: 'get',
        url: '/replies',
        middlewares: [
            replyController.getReplies
        ]
    },

    {
        method: 'post',
        url: '/reply',
        middlewares: [
            auth(),
            koaBody(),
            replyController.postReply
        ]
    }
]


module.exports = {
    routes
}

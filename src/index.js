const Koa = require("koa");

const koaStaticCache = require("koa-static-cache");

const koaRouter = require("koa-router");

const configs = require("./configs");

const { routes } = require("./routes");
const resHandler = require("./middlewares/res_handler");
const databaseConnections = require("./middlewares/database_connections");
const app = new Koa();

//  静态文件代理

app.use(
  koaStaticCache({
    prefix: configs.staticAssets.prefix,
    dir: configs.staticAssets.dir,
    dynamic: true,
    gzip: true,
  })
);

// 数据库连接
app.use(databaseConnections(configs.database));

//  创建路由中间件

const router = new koaRouter({
  prefix: configs.router.prefix,
});

//  绑定路由

routes.map((route) => {
  router[route.method](route.url, resHandler(), ...route.middlewares);
});

app.use(router.routes());

app.listen(configs.app.port, () => {
  console.log(`服务启动成功：http://localhost:${configs.app.port}`);
});

import Koa, { Context } from 'koa';
import KoaRouter from "koa-router";
import KoaBodyParser from "koa-bodyparser";
import { bootstrapControllers } from "koa-ts-controllers";
import { Sequelize } from "sequelize-typescript";
import jwt from "jsonwebtoken";
import Config from './config'

// 异步处理
(async () => {
    const App = new Koa();
    const Router = new KoaRouter();


    // 链接数据库
    const db = new Sequelize({
        ...Config.database,
        models: [
            __dirname + '/models/**/*.ts' //注models目录中不要出现index.ts（如：user/index.ts）不然会找不到！！要（要：user/User.ts）[而且文件名首字母大写，因为目录名和文件名不可相同]才行！！
        ]
    });
    // console.log(db);


    // 监听所有路由入口
    App.use(async (ctx, next) => {
        ctx.set("Access-Control-Allow-Origin", "*");

        // 获取前端从header中传过来的参数，
        let token = ctx.headers['mupiao'];
        // console.log('token', ctx.headers.mupiao);

        if (token) {
            // 将传过来的参数挂载到ctx下
            ctx.userInfo = jwt.verify(token, Config.jwt.verifyKey) as UserInfo;   // UserInfo是自定义挂载到koa中的一个对象（属性）
        };
        await next();

        // if (404 == ctx.status) {
        //     ctx.body = 404;
        // }
    });


    // 路由、控制器、API管理（注：这里需要异步处理 await）
    await bootstrapControllers(App, {
        router: Router,                                         // 绑定路由模块 
        basePath: '/api',                                       // 访问规则 localhost:8080/api/v2/控制器/接口
        versions: {                                             // 版本号 
            1: '此版本已弃用，不久将被删除！请尽快迁移到v2版本', // 可以同时开多个版本，这个是虽然能用，但是有警告信息
            2: true,                                            // 正常访问
            dangote: true                                       // 非常适合定制，业务客户端特定的端点版本
        },
        controllers: [                                          // 指定控制器类、接口存放目录，
            __dirname + '/controllers/**/*.ts'                  // 可直接添加到此数组中，也可以添加全局字符串（匹配controllers目录下的所以文件分析类指定到路由对象中）
        ],

        // errorHandler: async (err: any, ctx: any) => {        // 默认错误处理程序(可选)
        //     ctx.status = 500;
        //     ctx.body = { ...err };
        // },

        errorHandler: async (err: any, ctx: Context) => {       // 统一错误处理程序(可选)
            let status = 500;
            let body: any = {
                statusCode: status,
                error: 'Internal Server Error',
                message: '后台数据库 或 控制器、Api接口发生错误！',
                errorDetails: '内部服务器错误！'
            };
            if (err && err.output) {                            // 如果控制器类、接口中有错抛出时的返回处理
                let {statusCode, payload} = err.output;
                status = statusCode;                            // HTTP状态代码(通常4 xx或5 xx)
                body = payload;
                if (err.data) {          
                    body.errorDetails = err.data;               // 如果有错误详情时一并返回
                }
            };
            ctx.status = status;
            ctx.body = body;
        }
    });


    // Router.all('*', async (ctx, next) => {
    //     ctx.set("Access-Control-Allow-Origin", "*");
    //     await next();
    // });


    // 注册获取post参数模块
    App.use(KoaBodyParser());


    // 注册路由
    App.use(Router.routes());


    // 监听服务
    App.listen(Config.server.prot, Config.server.host, () => {
        console.log('服务启动成功：监听' + Config.server.host + ':' + Config.server.prot);
    });
})();
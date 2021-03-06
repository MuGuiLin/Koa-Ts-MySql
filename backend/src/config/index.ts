import path from "path";
import dbconfig from "./dbconfig.json";


// 定义数据库配置类型接口 用于规范dbconfig.json中的数据类型
interface DbConfigType {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'mariadb';
    timezone: string;
}

// 运行环境配置：开发，测试，生产
const config: any = {
    development: {
        server: {
            host: "localhost",
            prot: 3000
        },
        database: dbconfig.development as DbConfigType,  //由于dbconfig是一个json格式没有类型，所以在这里用接口业做中转换，不然在app.ts中的 new Sequelize(Config.database) 会报错
        jwt: {
            verifyKey: 'mupiao-token'   // 用户登录鉴权名
        },
        storage: {
            dir: path.resolve(__dirname, '../uploads'),  // 静态资源存储路径(以src为根目录)
            prefix: '/mupiao'   // 静态资源访问前缀(名字自定义，前面一定要加/)
        }
    },
    test: {
        server: {
            host: "localhost",
            prot: 3000
        },
        database: dbconfig.test as DbConfigType,
        jwt: {
            verifyKey: 'mupiao-token'
        }
    },
    production: {
        server: {
            host: "localhost",
            prot: 3000
        },
        database: dbconfig.production as DbConfigType,
        jwt: {
            verifyKey: 'mupiao-token'
        }
    }
};

// 约束config取值范围
// type configKey = 'development' | 'test' | 'production'; //这样是写死的值不灵活
type configKey = keyof typeof config;   // 用 keyof 来取对象的第一层key


// Node环境变量(process对象下的env属性 用于在Node环境下读取环境变量信息【后面的NODE_EVN是可以自定义的】)
const NODE_EVN: string | number | symbol = process.env.NODE_EVN as configKey || 'development';

// process报错：由于默认在ts环境中没有继承Node环境的相关API 所以要调用Node.js环境下的process对象需要安装第三方库 npm i -D @types/node

export default config[NODE_EVN];
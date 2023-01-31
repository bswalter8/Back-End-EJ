import dotenv from 'dotenv';
import path from 'path';

dotenv.config(
    {
        path: path.resolve(process.cwd(), `${process.env.NODE_ENV}.env`)
    }
);

const timeSession = parseInt(process.env.TIEMPO_EXPIRACION)

export default {
    server: {
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        PERS: process.env.PERS,
        EMAIL_SERVER:process.env.EMAIL_SERVER,
        EMAIL_PASS:process.env.EMAIL_PASS   
    },
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: `../DB/ecommerce.sqlite`
        },
        useNullAsDefault: true
    },
    mariaDb: {
        client : 'mysql',
        connection: {
            host: '192.168.64.2',
            user:'root',
            password:'',
            database:'eCommerce'
        }
    },
    mongodb: {
     
        cnxStr: process.env.MONGOURL_ENV,

        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
         //   useCreateIndex: true,
            serverSelectionTimeoutMS: 5000,
        }
    },
    fileSystem: {
        path: './DB',
        public: './public',
    },
     TIEMPO_EXPIRACION : timeSession,
     PRIVATE_KEY: process.env.PRIVATE_JWT

}

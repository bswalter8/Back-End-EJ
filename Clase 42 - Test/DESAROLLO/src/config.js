import dotenv from 'dotenv';

dotenv.config();

export default {
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: `./DB/ecommerce.sqlite`
        },
        useNullAsDefault: true
    },
    mariaDb: {
        client : 'mysql',
        connection: {
            host: '192.168.64.2',
            user:'root',
            password:'',
            database:'Ej16'
        }
    },
    mongodb: {
     //   cnxStr: 'mongodb+srv://kind59:H1Xm53ciKkBDdui2@cluster0.k5efrwt.mongodb.net/test',
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
     TIEMPO_EXPIRACION : 200000

}

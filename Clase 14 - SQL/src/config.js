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
    }
}

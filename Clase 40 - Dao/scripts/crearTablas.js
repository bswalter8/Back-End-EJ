import knex from 'knex'
import config from '../src/repositories/config.js'

//------------------------------------------
// productos en MariaDb

export function createTablaMariaDB(tabla){
        try {
            const mariaDbClient = knex(config.mariaDb)
            //Implementar creación de tabla
            mariaDbClient.schema.hasTable(tabla).then((exists)=>{
                if (!exists) {
                    mariaDbClient.schema.createTable(tabla,(table)=>{
                        table.increments('id');
                        table.string('name');
                        table.integer('price');
                        table.string('thumbnail');
                    }).then(()=>console.log('tabla creada'))
                        .catch( err => {console.log(err); throw err})                     
                    return        
                }
                else return console.log('La tabla  mariaDb ha sido creada con aterioridad') 
            })

            console.log('tabla productos en mariaDb creada con éxito')
        } catch (error) {
            console.log('error al crear tabla productos en mariaDb')
            console.log(error)
        }
}


//------------------------------------------
// mensajes en SQLite3
export function createTablaSQLlite(tabla){
    try {
        const sqlDbClient = knex(config.sqlite3)
        //Implementar creación de tabla
        sqlDbClient.schema.hasTable(tabla).then((exists)=>{
            if (!exists) {
                sqlDbClient.schema.createTable(tabla,(table)=>{
                    table.increments('id');
                    table.string('email');
                    table.string('msg');
                    table.string('time');
                }).then(()=>console.log('tabla creada'))
                    .catch( err => {console.log(err); throw err})                     
                return        
            }
            else return console.log('La tabla  SQLlite ha sido creada con aterioridad') 
        })

        console.log('tabla productos en SQLlite creada con éxito')
    } catch (error) {
        console.log('error al crear tabla productos en mariaDb')
        console.log(error)
    }
}



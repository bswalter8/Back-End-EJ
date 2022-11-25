import knex from 'knex';
import config from '../config/config.js'


//createTablaMariaDB('Ej16');




class ContenedorMariaDB {
    constructor(tablaNombre,config){
     //   this.knexConnection = knex(config);
        this.config = config;
        this.tabla = tablaNombre;    
     //   console.log('SQL conectado')
    }


    async init(){    
        this.knexConnection = knex(this.config);
        console.log('MariaDB  conectado');
    }

    async disconnect(){
        this.knexConnection.destroy();
    }

    async save(elem) {
        this.knexConnection(this.tabla).insert(elem)
              .then(()=>console.log('datos insertados'))
                  .catch( err => {console.log(err + '  ' + 'erorrrrr'); throw err})      
      }

    async getById(id) {
       return this.knexConnection.from(this.tabla).select('*')
            .where('id',id)
            .then((rows)=>{
               return rows
            })
                .catch( err => {console.log(err); throw err})
    }

    async getAll() {
       
      return await this.knexConnection.from(this.tabla).select('*')
            .then((rows)=>{       
                return rows
            })
            .catch( err => {console.log(err); throw err})
    }

   

    async actualizar(elem, id) {
        this.knexConnection.from(this.tabla).select('*')
            .where('id',id)
            .update(elem)
            .then(console.log('registro actualizado'))
            .catch( err => {console.log(err); throw err})
    }



    async deleteById(id) {
        this.knexConnection(this.tabla).where('id',id)
            .del()
            .then(()=>console.log('registro borrado'))
            .catch( err => {console.log(err); throw err})
    }

    async deleteAll() {
        this.knexConnection(this.tabla)
            .del()
            .then(()=>console.log('todos los registro borrados'))
            .catch( err => {console.log(err); throw err})
    }

 
}

export default ContenedorMariaDB
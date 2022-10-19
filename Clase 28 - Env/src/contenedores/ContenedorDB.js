import knex from 'knex';



class ContenedorDB {
    constructor(config,tabla){
        this.knexConnection = knex(config);
        this.tabla = tabla;    
    }

    async listar(id) {
       return this.knexConnection.from(this.tabla).select('*')
            .where('id',id)
            .then((rows)=>{
               return rows
            })
                .catch( err => {console.log(err); throw err})
    }

    async listarAll() {
      return  this.knexConnection.from(this.tabla).select('*')
            .then((rows)=>{       
                return rows
            })
            .catch( err => {console.log(err); throw err})
    }

    async guardar(elem) {
      this.knexConnection(this.tabla).insert(elem)
            .then(()=>console.log('datos insertados'))
                .catch( err => {console.log(err + '  ' + 'erorrrrr'); throw err})      
    }

    async actualizar(elem, id) {
        this.knexConnection.from(this.tabla).select('*')
            .where('id',id)
            .update(elem)
            .then(console.log('registro actualizado'))
            .catch( err => {console.log(err); throw err})
    }



    async borrar(id) {
        this.knexConnection(this.tabla).where('id',id)
            .del()
            .then(()=>console.log('registro borrado'))
            .catch( err => {console.log(err); throw err})
    }

    async borrarAll() {
        this.knexConnection(this.tabla)
            .del()
            .then(()=>console.log('todos los registro borrados'))
            .catch( err => {console.log(err); throw err})
    }

    async desconectar() {
        this.knexConnection.destroy();
    }
}

export default ContenedorDB
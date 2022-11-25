import mongoose from 'mongoose'
import config from '../config/config.js'




const messageSchema = new mongoose.Schema(
  { 
      author: {
             email: { type: String, required: true},
             nombre: { type: String, required: false},
             apellido: { type: String, required: false}, 
             edad: { type: Number, required: false}, 
             alias: { type: String, required: false},
             avatar: { type: String, required: false}
         },
         text: { type: String, required: false}
  }

);


class ContenedorMongoDb {

    constructor(nombreColeccion,cnxStr, options) {
      try {
        this.coleccion = mongoose.model(nombreColeccion, messageSchema)
        this.cnxStr = cnxStr;
        this.options = options;
        let id = 0
     //   console.log("Base MongoDB conectada")
      }catch (err){
        console.log(err)
      }
    }

    async init(){
        try {
            await mongoose.connect(this.cnxStr, this.options)
            console.log("Base MongoDB conectada");
        } catch(error){
            console.log(error)
        }
    }

    async disconnect(){
        console.log('Contenedor de archivo desconectado');
    }

    async getAll() {
        try{
            const productosRead = await this.coleccion.find();
            return productosRead;
        }catch(err){ 
            console.log(err)
        } 
    }

    async save(nuevoElem) {
      try{

        const productoSaveModel = new this.coleccion(nuevoElem)
        let productoSave = await productoSaveModel.save()
        return productoSave
    }catch(err){ 
        console.log(err)
        return null
    }
    }

     
}

export default ContenedorMongoDb
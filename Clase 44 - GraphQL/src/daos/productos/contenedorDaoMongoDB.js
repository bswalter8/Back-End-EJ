import mongoose from 'mongoose'
import config from '../../config/config.js'



const productosSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
  //  descripcion: { type: String, required: true },
  //  categoria: { type: String, required: true },
    thumbnail: { type: String, required: true },
  });

class ContenedorMongoDb {

    constructor(nombreColeccion,cnxStr, options) {
      try {
        this.coleccion = mongoose.model(nombreColeccion, productosSchema)
        this.cnxStr = cnxStr;
        this.options = options;
        let id = 0
      }catch (err){
        console.log(err)
      }
    }

    async init(){
        try {
            await mongoose.connect(this.cnxStr, this.options)
            console.log("Base MongoDB Conectada");
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

    async update(nuevoElem, id) {
        try{
            const productoAct = await this.coleccion.updateOne({ "_id": id }, {$set: nuevoElem})
           // return `Producto con ID: ${id} actualizado`
           return productoAct
        }catch(err){ 
            console.log(err)
            return null
        }
    }

    async getById(id) {
        try{
            const productosRead = await this.coleccion.find({ "_id": id }, {__v: 0});
            if (productosRead.length == 0){
                console.log('Producto no encontrado');
                return null
            } else {
                return productosRead;
            }          
        }catch(err){ 
            console.log(err)
        } 
    }  

    async deleteById(id) {
        try{
            const productosRead = await this.coleccion.deleteOne({ "_id": id });
                console.log('Producto Borrado')
                return  productosRead
        }catch(err){ 
            console.log(err)
        } 
    }

    async create() {
        
    }
}

export default ContenedorMongoDb
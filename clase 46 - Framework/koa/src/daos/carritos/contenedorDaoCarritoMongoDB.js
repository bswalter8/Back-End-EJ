import mongoose from 'mongoose'
import config from '../../config/config.js'


const carritoSchema = new mongoose.Schema({
    idUser: { type: String, required: true },
    timestamp: { type: Date, required: true },
    products: { type: Array, required: true },
    delivery: { type: Array, required: true }
  });

class ContenedorCarritoMongoDb {

    constructor(nombreColeccion,cnxStr, options) {
      try {
        this.coleccion = mongoose.model(nombreColeccion, carritoSchema)
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
            console.log("Base MongoDB Carritos conectada");
        } catch(error){
            console.log(error)
        }
    }

    async disconnect(){
        console.log('Base MongoDB Carritos desconectado');
    }

    async getAll() {
        try{
            const carritoRead = await this.coleccion.find();
            return carritoRead;
        }catch(err){ 
            console.log(err)
        } 
    }

    async deleteById(id) {
        try{
            const carritoRead = await this.coleccion.deleteOne({ "_id": id });
                console.log('Carrito Borrado')
                return  carritoRead
        }catch(err){ 
            console.log(err)
        } 
    }


    async getById(idName) {
        try {    
          const datos = await this.coleccion.find({ "idUser": idName }, {__v: 0});      
          if (datos.length !== 0) {
            return datos[0].products;
    
          } else {
            return (`El carrito con id:${idName} no existe.`);
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }


async add(idName) {
    try {
      const datos = await this.coleccion.find();
      if (datos.length === 0) {
        const carrito = { id: 1, timestamp: Date.now(), products: [], idUser: idName };
        await this.coleccion.create(carrito);
        return carrito.id;
      } else {
        const carrito = { id: 1, timestamp: Date.now(), products: [], idUser: idName };
        carrito.id = datos[datos.length - 1].id + 1;
        await this.coleccion.create(carrito);
        return carrito.id;
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  

  async setCart(product, idName) {
    try {
   
      const carrito =  await this.coleccion.find({ "idUser": idName }, {__v: 0});
      let idProducto;  
      if (!carrito.empty) {
      //  const carrito = datos[0].products;
        if (carrito[0].products.length === 0) {
            idProducto = 1;
        } else {
            let maxNum = 0;
            carrito[0].products.forEach(element => {
               if (element.id > maxNum){
                    maxNum = element.id;
               } 
            });
            idProducto = maxNum +1;
        }
        let nuevoProducto = {id: idProducto, ...product}

        carrito[0].products.push(nuevoProducto);
       
        
        const res = await this.coleccion.updateOne({idUser: idName}, {$set:{products : carrito[0].products}})
        console.log(res)
      //  const res = await this.coleccion.updateOne({ "idUser": idName }, carrito);
        return res;
      } else {
        return (`El producto con id: ${idName} no existe.`);
      }
    } catch (error) {
      console.log(`El producto con id: ${idName} no existe.`);
    }
  }


  async deleteProdByCartId(idName, id_prod) {
    try {
      const datos = await this.coleccion.find({ "idUser": idName }, {__v: 0});
      if (datos.length !== 0) {
     //   const carrito = datos.find((cart) => cart.id === id);
        const updateProducts = datos[0].products.filter(
          (prod) => prod.id != id_prod
        );

        const res = await  this.coleccion.updateOne({idUser: idName}, {$set:{products : updateProducts}});
        return res;
      } else {
        return (`El carrito con id: ${id} no existe.`);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  } 
}

export default ContenedorCarritoMongoDb
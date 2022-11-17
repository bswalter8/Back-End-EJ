import mongoose from 'mongoose'
import config from '../config.js'

try {
    await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)
   
} catch(error){
    console.log(error)
}


class ContenedorMongoDb {

    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
       
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
 

    async getAll() {
        try{
            const productosRead = await this.coleccion.find();
            return productosRead;
        }catch(err){ 
            console.log(err)
        } 
    }

    async add(nuevoElem) {
      try{
        const producto = {
            title: nuevoElem.title,
            price: nuevoElem.price,
            thumbnail : nuevoElem.thumbnail
        }
        const productoSaveModel = new this.coleccion(producto)
        let productoSave = await productoSaveModel.save()
        return productoSave
    }catch(err){ 
        console.log(err)
        return null
    }
    }

    async set(nuevoElem, id) {
        try{
            const productoAct = await this.coleccion.updateOne({ "_id": id }, {$set: {
                "title": nuevoElem.title,
                "price": nuevoElem.price,
                "thumbnail" : nuevoElem.thumbnail
            }})
            return `Producto con ID: ${id} actualizado`
        }catch(err){ 
            console.log(err)
            return null
        }
    }

    async deleteById(id) {
        try{
            const productosRead = await this.coleccion.deleteOne({ "_id": id });
                console.log('Producto Borrado')
                return  `Producto con Id: ${id} borrado`
        }catch(err){ 
            console.log(err)
        } 
    }

    async deleteAll() {
        try{
            const productosRead = await this.coleccion.deleteMany({});
                return  `Todos los productos han sido borrados`
        }catch(err){ 
            console.log(err)
        } 
    }

/*---------------------------Carrito------------------------------- */

async addCart(idName) {
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

  /*async getCartbyId(id) {
    try {
      const datos = await this.coleccion.find({ "_id": id }, {__v: 0});
      if (datos.length !== 0) {
        const carrito = datos.find((cart) => cart.id === id);
        if (carrito.products.length === 0) {
          return { Products: "vacio" };
        } else {
          return carrito.products;
        }
      } else {
        return (`El carrito con id:${id} no existe.`);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }*/

  async getCartbyIdName(idName) {

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


  async deteleProdByCartId(idName, id_prod) {
    try {
      const datos = await this.coleccion.find({ "idUser": idName }, {__v: 0});
      if (datos.length !== 0) {
     //   const carrito = datos.find((cart) => cart.id === id);
        const updateProducts = datos[0].products.filter(
          (prod) => prod.id != id_prod
        );
        console.log(updateProducts)
        const res = await  this.coleccion.updateOne({idUser: idName}, {$set:{products : updateProducts}});
        return res;
      } else {
        return (`El carrito con id: ${id} no existe.`);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  } 


 /* async setCart(product, id) {
    try {
      
      const datos =  await this.coleccion.find({ "_id": id }, {__v: 0});
      let idProducto;  
      if (!datos.empty) {
        const carrito = datos.find((cart) => cart.id === id);
        if (carrito.products.length === 0) {
            idProducto = 1;
        } else {
            let maxNum = 0;
            carrito.products.forEach(element => {
               if (element.id > maxNum){
                    maxNum = element.id;
               } 
            });
            idProducto = maxNum +1;
        }
        let nuevoProducto = {id: idProducto, ...product}

        carrito.products.push(nuevoProducto);
        console.log(carrito)
        const res = await this.coleccion.updateOne({ "_id": id}, carrito);
        return res;
      } else {
        return (`El producto con id: ${id} no existe.`);
      }
    } catch (error) {
      console.log(`El producto con id: ${id} no existe.`);
    }
  }


  async deteleProdByCartId(id, id_prod) {
    try {
      const datos = await this.coleccion.find({ "_id": id }, {__v: 0});
      if (datos.length !== 0) {
        const carrito = datos.find((cart) => cart.id === id);
        carrito.products = carrito.products.filter(
          (prod) => prod.id != id_prod
        );
        const res = await this.coleccion.updateOne({ "_id": id }, carrito);
        return res;
      } else {
        return (`El carrito con id: ${id} no existe.`);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }    */
}

export default ContenedorMongoDb
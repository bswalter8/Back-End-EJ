import mongoose from 'mongoose'
import CustomMsg from '../models/CustomMsg.class.js';





class ContenedorMongoDb {

    constructor(modelo,cnxStr,options) {
        this.coleccion = modelo;
        this.cnxStr = cnxStr;
        this.options = options;
        let id = 0
    }

    async init(){
        try {
            await mongoose.connect(this.cnxStr, this.options)
      //      console.log("Base MongoDB Conectada");
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
            return new CustomMsg(200, 'Elemento guardado', productoSave);
         
        }catch(err){ 
            const error = new CustomMsg(500, 'Se ha producido un error guardando el elemento', err);
            return error 
        }
    }

    async update(nuevoElem, id) {
        try{
            const elementAct = await this.coleccion.updateOne({ "_id": id }, {$set: nuevoElem})
           // return `Producto con ID: ${id} actualizado`
           return  new CustomMsg(200, `Producto con ID: ${id} actualizado`, elementAct);
        }catch(err){ 
          const error = new CustomMsg(500, `Se ha producido un error actualizando el elemento con id ${id}`, err);
          return error 
        }
    }

    async getById(id) {
        try{
            const elementRead = await this.coleccion.find({ "_id": id }, {__v: 0});
            console.log(elementRead)
            if (elementRead.length == 0){
                console.log('Producto no encontrado');
                const error = new CustomMsg(404, `Elemento con id:${id} no encontrado`, 'err');
                return error 
            } else {
                return elementRead;
            }          
        }catch(err){ 
            console.log(err)
        } 
    }  

    async deleteById(id) {
        try{
            const elementDelete = await this.coleccion.deleteOne({ "_id": id });
                console.log('Producto Borrado')
                return new CustomMsg(200, 'Elemento borrado', elementDelete);
        }catch(err){ 
        //    console.log(err)
            const error = new CustomMsg(404, `Elemento con id:${id} no encontrado`, err);
            return error 
        } 
    }

    
    async create() {
        
    }


    async add(idName) {
        try {
          const datos = await this.coleccion.find();
          if (datos.length === 0) {
            const carrito = { id: 1, timestamp: Date.now(), products: [], idUser: idName };
            await this.coleccion.create(carrito);
            return new CustomMsg(200, 'Carrito creado', carrito.id);
          //  return carrito.id;
          } else {
            const carrito = { id: 1, timestamp: Date.now(), products: [], idUser: idName };
            carrito.id = datos[datos.length - 1].id + 1;
            await this.coleccion.create(carrito);
            return new CustomMsg(200, 'Carrito creado', carrito.id);
           // return carrito.id;
          }
        } catch (err) {
          const error = new CustomMsg(500, `No se pudo crear el carrito`, err);
          return error 
       //   console.log(`Error: ${error}`);
        }
      }
    
      
    
      async setCartProduct(product, idName) {
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
                   if (element.idProductoCarrito > maxNum){
                        maxNum = element.idProductoCarrito;
                   } 
                });
                idProducto = maxNum +1;
            }
            let nuevoProducto = {idProductoCarrito: idProducto, ...product}
            console.log(nuevoProducto)
            carrito[0].products.push(nuevoProducto);
           
            
            const res = await this.coleccion.updateOne({idUser: idName}, {$set:{products : carrito[0].products}})
            console.log(res)
          //  const res = await this.coleccion.updateOne({ "idUser": idName }, carrito);
            return new CustomMsg(200, `El carrio con id: ${carrito.id} ha sido actualizado.`, res);
      //      return res;
          } else {
            const error = new CustomMsg(500, `El producto con id: ${idName} no existe.`, err);
            return error 
          }
        } catch (err) {
            console.log(`El producto con id: ${idName} no existe.`);
            const error = new CustomMsg(500, `El producto con id: ${idName} no existe.`, err);
            return error 
        }
      }
    
      async updateCartProduct(idName,idProduct, newProduct){ 
        try {
          const cart = await this.coleccion.findOne({ idUser: idName});
          if (cart) {
            let cartUpdated = [];
            
            for (let prod of cart.products){
                if(prod.idProductoCarrito == idProduct){
                  prod = {idProductoCarrito:idProduct, ...newProduct};
                }
                cartUpdated.push(prod);
              }
              console.log(cartUpdated)  
            const res = await this.coleccion.updateOne(
              { idUser: idName },
              { products: cartUpdated }
            );
            return new CustomMsg(200, `El producto del carrito id: ${idName} ha sido actualizado.`, res);
          } else {
            return new CustomMsg(500, `El carrito con idUser: ${idName} no existe.`, 'error');
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }



      async deleteProdByCartId(idName, idProduct) {
        try {
          const cart = await this.coleccion.findOne({ idUser: idName});
          if (cart) {
            const cartUpdated = cart.products.filter(
              (prod) => prod.idProductoCarrito != idProduct
            );
            const res = await this.coleccion.updateOne(
              { idUser: idName },
              { products: cartUpdated }
            );
            return new CustomMsg(200, `El producto del carrito id: ${idName} ha sido borrado.`, res);
          } else {
            return new CustomMsg(500, `El carrito con idUser: ${idName} no existe.`, 'error');
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }


    
}

export default ContenedorMongoDb
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
   //         console.log(elementRead)
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

    async getByCat(cat) {
   
      try{
      
         const elementRead =  await this.coleccion.find({ categoria: cat }, {__v: 0});

          if (elementRead.length == 0){

              const error = new CustomMsg(404, `Elemento con id:${cat} no encontrado`, 'err');
              return error 
          } else {
            
              return elementRead;
          }          
      }catch(err){ 
          console.log(err)
      } 
  }  


      async getByQuery(query) {
      
        try{
        
          const elementRead =  await this.coleccion.find(query);
   
            if (elementRead.length == 0){
  
                const error = new CustomMsg(404, `Elemento con id:${cat} no encontrado`, 'err');
                return error 
            } else {

                return elementRead;
            }          
        }catch(err){ 
            console.log(err)
        } 
    }  



    async getByUserName( elementSearch) {
      try{
          const elementRead = await this.coleccion.find({ 'userName': elementSearch }, {__v: 0});
   
          if (elementRead.length == 0){
              console.log('Producto no encontrado');
              const error = new CustomMsg(404, `Elemento con 'userName:${elementSearch} no encontrado`, 'err');
              return error 
          } else {
              return elementRead[0];
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

            const error = new CustomMsg(404, `Elemento con id:${id} no encontrado`, err);
            return error 
        } 
    }

    
    async createRole(user,role) {
      const userRole = { id: user._id, timestamp: Date.now(), role: role };
      await this.coleccion.create(userRole);
      return new CustomMsg(200, 'Role creado', '');
    }


    async add(user) {
        try {
       

            const carrito = {_id: user._id, timestamp: Date.now(), products: [], idUser: user.username};
            await this.coleccion.create(carrito);
            return new CustomMsg(200, 'Carrito creado', carrito);

        } catch (err) {
          const error = new CustomMsg(500, `No se pudo crear el carrito`, err);
          return error 

        }
      }
    
      
    
      async setCartProduct(product, id) {
        try {
       
          const carrito =  await this.coleccion.find({ "_id": id }, {__v: 0});
          let idProducto;  
          if (!carrito.empty) {
    
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

            carrito[0].products.push(nuevoProducto);
           
            
            const res = await this.coleccion.updateOne({_id: id}, {$set:{products : carrito[0].products}})
    
            return new CustomMsg(200, `El carrio con id: ${carrito.id} ha sido actualizado.`, res);

          } else {
            const error = new CustomMsg(500, `El producto con id: ${id} no existe.`, err);
            return error 
          }
        } catch (err) {
            console.log(`El producto con id: ${id} no existe.`);
            const error = new CustomMsg(500, `El producto con id: ${id} no existe.`, err);
            return error 
        }
      }
    
      async updateCartProduct(id,idProduct, newProduct){ 
        try {
          const cart = await this.coleccion.findOne({ _id: id});
          if (cart) {
            let cartUpdated = [];
            
            for (let prod of cart.products){
                if(prod.idProductoCarrito == idProduct){
                  prod = {idProductoCarrito:parseInt(idProduct), ...newProduct};
                }
                cartUpdated.push(prod);
              }

            const res = await this.coleccion.updateOne(
              { _id: id },
              { products: cartUpdated }
            );
            return new CustomMsg(200, `El producto del carrito id: ${idProduct} ha sido actualizado.`, res);
          } else {
            return new CustomMsg(500, `El carrito con idUser: ${id} no existe.`, 'error');
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }



      async deleteProdByCartId(id, idProduct) {
        try {
          const cart = await this.coleccion.findOne({ _id: id});
          if (cart) {
            const cartUpdated = cart.products.filter(
              (prod) => prod.idProductoCarrito != idProduct
            );
            const res = await this.coleccion.updateOne(
              { _id: id },
              { products: cartUpdated }
            );
            return new CustomMsg(200, `El producto del carrito id: ${idProduct} ha sido borrado.`, res);
          } else {
            return new CustomMsg(500, `El carrito con idUser: ${id} no existe.`, 'error');
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }


      
      async deleteAllProductsByCartId(id) {
        try {
          const cart = await this.coleccion.findOne({_id: id});
          if (cart) {
             cart.products = [];
            const res = await this.coleccion.updateOne(
              { _id: id },
              { products: cart.products }
            );
            return new CustomMsg(200, `Los productos del carrito id: ${id} ha sido borrado.`, res);
          } else {
            return new CustomMsg(500, `El carrito con idUser: ${id} no existe.`, 'error');
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }


    
}

export default ContenedorMongoDb
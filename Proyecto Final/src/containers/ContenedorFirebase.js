import admin from "firebase-admin"
import config from '../config.js'
import {collection, doc, addDoc} from '@firebase/firestore'

admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
    databaseURL:  'https://backend-carrito-4945e.firebaseio.com'
})

const db = admin.firestore();


class ContenedorFirebase {

    constructor(nombreColeccion) {
        this.coleccion = db.collection(nombreColeccion);
        this.idProducto = 0;
    }

    async save(product){
        try {
          const datos = await this.coleccion.orderBy('id').get();
          if (datos.empty) {
            product.id = 1;
            product.timestamp = Date.now().toLocaleTimeString()();
            await this.coleccion.add(product);
            return product.id;
          } else {
            const products = datos.docs.map(doc =>  doc.data());
            let maxNum = 0;
            products.forEach(element => {
               if (element.id > maxNum){
                    maxNum = element.id;
               } 
            })
            product.id = maxNum +1;
           // product.id = products[products.length - 1].id + 1;
            product.timestamp = Date.now().toLocaleTimeString()();
            await this.coleccion.add(product);
            return product.id;
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }
    
  
    
      async getAll() {
        try {
          const datos = await this.coleccion.orderBy('id').get();
          if (!datos.empty) {
            const products = datos.docs.map(doc =>  doc.data());
              return products;
          } else {
            console.log(`No hay productos.`);
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }
      
      async getAllCart(reqId) {
        let id = Number(reqId);
        try {
          const datos = await this.coleccion.orderBy('id').get();
          if (!datos.empty) {
            const carritos = datos.docs.map(doc =>  doc.data());
            if (carritos.find((cart) => cart.id === id)) {
              const carrito = carritos.find((cart) => cart.id === id);
              if (carrito.products.length === 0) {
                return { Products: "vacio" };
              } else {
                return carrito.products;
              }
            } else {
                return `El Carrito con id: ${id} no existe`;
              }
          } else {
            console.log(`No hay datos.`);
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }
      async getById(reqId) {
        let id = Number(reqId);
        try {
          const datos = await this.coleccion.where('id', '==', id).get();
         
          if (!datos.empty) {
            const products = [];      
              datos.forEach(doc => {
                products.push(doc.data());
              });
              console.log(products)
              return products.find(prod => prod.id == id);
          } else {
            return `No existe producto con Id: ${id}`;
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }

      async update(product,reqId) {
        let id = Number(reqId);
        try {
          const datos = await this.coleccion.where('id', '=', id).get();
          if (!datos.empty) {
            const docID = datos.docs.map(doc => doc.id);
            const res = await this.coleccion.doc(docID[0]).update(product);        
            return res;
          } else {
            console.log(`El producto con id: ${id} no existe.`);
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }

      
      async deleteById(reqId) {
        let id = Number(reqId);
        try {
          const datos = await this.coleccion.where('id', '=', id).get();
          if (!datos.empty) {
            const docID = datos.docs.map(doc => doc.id);
            const res = await this.coleccion.doc(docID[0]).delete();        
            console.log(res);
            return res;
            
          } else {
            console.log(`El producto con id: ${id} no existe.`);
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }
    /*--------------------Carrito-------------------- */

    async addCart(){
        try {
        const datos = await this.coleccion.orderBy('id').get();
        if (datos.empty) {
            const carrito = {id: 1, timestamp: Date.now() , products: [] };
            await this.coleccion.add(carrito);
            return carrito.id;
        } else {
            const carritos = datos.docs.map(doc =>  doc.data());
            const carrito = {id: 1, timestamp: Date.now(), products: []};
            let maxNum = 0;
            carritos.forEach(element => {
            if (element.id > maxNum){
                    maxNum = element.id;
            } 
            })
            carrito.id = maxNum +1;
        //   carrito.id = carritos[carritos.length - 1].id + 1;
            await this.coleccion.add(carrito);
            return carrito.id;
        }
        } catch (error) {
        console.log(`Error: ${error}`);
        }
    }
    
      
    
      async getCartbyId(reqId) {
        let id = Number(reqId);
        try {
          const datos = await this.coleccion.where('id', '==', id).get();     
          if (!datos.empty) {
              const carritos = datos.docs.map(doc => doc.data());
              const carrito = carritos.find(cart => cart.id === id);
              console.log(carrito)
            if (carrito.products == null) {
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
      }


     
    
      async setCartProduct(product,reqId) {
        let id = Number(reqId);
        try {
            let productAdd = {}  
          const datos = await this.coleccion.where('id', '=', id).get();
          if (!datos.empty) {
            const docID = datos.docs.map(doc => doc.id);
            let prodID = 0;
            const carritos = datos.docs.map(doc => doc.data());
            const carrito = carritos.find(cart => cart.id === id)
            console.log(carrito)
            if (carrito.products.length == 0){
                 productAdd = {id: 1, ...product};
            } else {
                 productAdd = {id: 1, ...product};
                let maxNum = 0;         
                carrito.products.forEach(element => {
                if (element.id > maxNum){
                        maxNum = element.id;
                } 
                })
                productAdd.id = maxNum +1;  
            }
            carrito.products.push(productAdd);
            const res = await this.coleccion.doc(docID[0]).update(carrito);        
            return res;
          } else {
            console.log(`El producto con id: ${id} no existe.`);
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }
    
    
      async updateCartProduct(reqId) {
        let id = Number(reqId);
        try {
          const datos = await this.coleccion.where('id', '=', id).get();
          if (!datos.empty) {
            const docID = datos.docs.map(doc => doc.id);
            const res = await this.coleccion.doc(docID[0]).delete();        
            console.log(res);
            return res;
            
          } else {
            console.log(`El carrito con id: ${id} no existe.`);
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }
    
      async deteleProdByCartId(reqId, reqId_prod){
        let id_prod = Number(reqId_prod);
        let id = Number(reqId);
        try {
          const datos = await this.coleccion.where('id', '=', id).get();
          if (!datos.empty) {
            const docID = datos.docs.map(doc => doc.id);
            const carritos = datos.docs.map(doc => doc.data());
            const carrito = carritos.find(cart => cart.id === id)
            carrito.products = carrito.products.filter(prod => prod.id !== id_prod)
            const res = await this.coleccion.doc(docID[0]).update(carrito);         
            return res;
            
          } else {
            console.log(`El carrito con id: ${id} no existe.`);
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }
}

export default ContenedorFirebase
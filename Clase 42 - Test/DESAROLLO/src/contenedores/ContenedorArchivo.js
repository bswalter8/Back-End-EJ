import { promises as fs } from 'fs'
import config from '../config.js'

class ContenedorArchivo {

    constructor(ruta) {
     this.archivoNombre = `${config.fileSystem.path}/${ruta}`;
      
    }

    async getById(id_Requerida) {
        try {
          let id = null;
          let contenidoLeido = [];
          let contenido = await fs.readFile(this.archivoNombre, "utf-8");
          contenidoLeido = JSON.parse(contenido);
    
          contenidoLeido.forEach((element) => {
            if (element.id == id_Requerida) {
              id = element;
            }
          });
          return id;
        } catch (error) {
          console.log(`OHHHHH nooooooo!!!! ${error}`);
        }
      }

    async getAll() {
        try {
          let id;
          let contenidoLeido = [];
          let contenido = await fs.readFile(this.archivoNombre, "utf-8");
          contenidoLeido = JSON.parse(contenido);
          return contenidoLeido;
        } catch (error) {
          console.log(`OHHHHH nooooooo!!!! ${error}`);
        }
      }

      
    async add(producto) {
        try {
          let contenidoLeido = [];
          let contenido = await fs.readFile(this.archivoNombre, "utf-8");
            console.log(contenido)
          let nuevaID; 
          let d = new Date();
           let  timeStamp = d.toLocaleTimeString();
          if (contenido != "") {
            contenidoLeido = JSON.parse(contenido);
            let idIndex = contenidoLeido.length -1;
            nuevaID =  contenidoLeido[idIndex].id;
            nuevaID ++;      
            contenidoLeido.push({ ...producto, timeStamp,id: nuevaID });
          } else {
            nuevaID = 1;
            contenidoLeido = [{ ...producto, timeStamp,id: nuevaID }];
          }
          try {
            const write = await fs.writeFile(this.archivoNombre,JSON.stringify(contenidoLeido),"utf-8");
            return nuevaID;
          } catch (error) {
            console.log(`Error en escritura: ${error}`);
          }
        } catch (error) {
          console.log(`Error en lectura: ${error}`);
        }
      }

    async set(elem, id_Requerida) {
        try {
            let id = null;
            let contenidoLeido = [];
            let contenido = await fs.readFile(this.archivoNombre, "utf-8");
            contenidoLeido = JSON.parse(contenido);     
            contenidoLeido.forEach((element, i) => {
              if (element.id == id_Requerida) {
                contenidoLeido[i] = { ...elem, id: id_Requerida };
              }
            });
            try {
                const write = await fs.writeFile(this.archivoNombre,JSON.stringify(contenidoLeido),"utf-8");
                return 
              } catch (error) {
                console.log(`OHHHHH nooooooo!!!! ${error}`);
              }
          } catch (error) {
            console.log(`OHHHHH nooooooo!!!! ${error}`);
          }     
    }

    async deleteById(id_Requerida) {
        try {
          let contenidoLeido = [];
    
          let contenido = await fs.readFile(this.archivoNombre, "utf-8");
          contenidoLeido = JSON.parse(contenido);
    
          contenidoLeido.forEach((element, i) => {
            if (element.id == id_Requerida) {
              contenidoLeido.splice(i, 1);
            }
          });
    
          try {
            await fs.writeFile(this.archivoNombre,JSON.stringify(contenidoLeido),"utf-8");
            console.log(`Se ha borrado el elemento con ID: ${id_Requerida}`);
          } catch (error) {
            console.log(`OHHHHH nooooooo!!!! borrado ${error}`);
          }
        } catch (error) {
          console.log(`OHHHHH nooooooo!!!! ${error}`);
        }
      }

      async deleteAll() {
        try {
          await fs.writeFile(this.archivoNombre, "", "utf-8");
          console.log(`Se ha borrado todo el contenido`);
        } catch (error) {
          console.log(`OHHHHH nooooooo!!!! borrado ${error}`);
        }
      }


/*---------------------------Carrito------------------------------- */

async addCart() {
    try {
        let nuevaID; 
        let contenidoLeido = [];  
        let d = new Date();
        let  timeStamp = d.toLocaleTimeString();  
        let contenido = await fs.readFile(this.archivoNombre, "utf-8");
       // contenidoLeido = JSON.parse(contenido);
        if (contenido != "[]") {
            contenidoLeido = JSON.parse(contenido);
            let idIndex = contenidoLeido.length -1;
            nuevaID =  contenidoLeido[idIndex].id;
            nuevaID ++;      
            contenidoLeido.push({productos: [], timeStamp,id: nuevaID });
          } else {
            nuevaID = 1;
            contenidoLeido = [{productos: [], timeStamp,id: nuevaID }];
          }
          try {
            const write = await fs.writeFile(this.archivoNombre,JSON.stringify(contenidoLeido),"utf-8");
            return nuevaID;
          } catch (error) {
            console.log(`Error en escritura: ${error}`);
          }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  async getCartbyId(id,id_prod) {
    try {
        let datos = await fs.readFile(this.archivoNombre,"utf-8");
        if (datos) {
          const carts = JSON.parse(datos);      
          const cart = carts.find((cart) => cart.id == id);          
       //   const res = cart.productos.find((prod) => prod.id == id_prod);
          console.log(cart)
          return cart
        } else {
          console.log(`El Carrito con id: ${id} no existe.`);
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
  }

  async setCart(product, id) {
    try {
        const carrito = await this.getById(id);    
        let d = new Date();
        let  timeStamp = d.toLocaleTimeString();
        let productAdd = {id: 1, ...product};
        if(carrito.productos == null){           
            carrito.productos = []
            carrito.productos.push(productAdd);
        } else {
            productAdd = {id: 1, ...product};
                let maxNum = 0;         
                carrito.productos.forEach(element => {
                if (element.id > maxNum){
                        maxNum = element.id;}})
            productAdd.id = maxNum +1; 
            carrito.productos.push(productAdd);
        }
        return await this.set(carrito,id);
    }  catch (error) {
        console.log(`Error: ${error}`);
      }
  }


  async deteleProdByCartId(id, id_prod) {

    const carrito = await this.getById(id);
    carrito.productos.forEach((element, i) => {
        if (element.id == id_prod) {
            carrito.productos.splice(i, 1);
        }
      });
    const respuesta = await this.set(carrito,id);
    return respuesta
  }


}


export default ContenedorArchivo
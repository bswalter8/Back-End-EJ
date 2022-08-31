const fs = require("fs");

class ContenedorArchivo {

    constructor(archivo) {
        this.archivoNombre = archivo;
        this.id;
    }

    async getById(id_Requerida) {
        try {
          let id = null;
          let contenidoLeido = [];
          let contenido = await fs.promises.readFile(this.archivoNombre, "utf-8");
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
          let contenido = await fs.promises.readFile(this.archivoNombre, "utf-8");
          contenidoLeido = JSON.parse(contenido);
          return contenidoLeido;
        } catch (error) {
          console.log(`OHHHHH nooooooo!!!! ${error}`);
        }
      }

    async save(producto) {
        try {
          let contenidoLeido = [];
          let contenido = await fs.promises.readFile(this.archivoNombre, "utf-8");
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
            const write = await fs.promises.writeFile(this.archivoNombre,JSON.stringify(contenidoLeido),"utf-8");
            return nuevaID;
          } catch (error) {
            console.log(`OHHHHH nooooooo!!!! ${error}`);
          }
        } catch (error) {
          console.log(`OHHHHH nooooooo!!!! ${error}`);
        }
      }

    async actualizar(elem, id_Requerida) {
        try {
            let id = null;
            let contenidoLeido = [];
            let contenido = await fs.promises.readFile(this.archivoNombre, "utf-8");
            contenidoLeido = JSON.parse(contenido);     
            contenidoLeido.forEach((element, i) => {
              if (element.id == id_Requerida) {
                contenidoLeido[i] = { ...elem, id: id_Requerida };
              }
            });
            try {
                const write = await fs.promises.writeFile(this.archivoNombre,JSON.stringify(contenidoLeido),"utf-8");
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
    
          let contenido = await fs.promises.readFile(this.archivoNombre, "utf-8");
          contenidoLeido = JSON.parse(contenido);
    
          contenidoLeido.forEach((element, i) => {
            if (element.id == id_Requerida) {
              contenidoLeido.splice(i, 1);
            }
          });
    
          try {
            await fs.promises.writeFile(this.archivoNombre,JSON.stringify(contenidoLeido),"utf-8");
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
          await fs.promises.writeFile(this.archivoNombre, "", "utf-8");
          console.log(`Se ha borrado todo el contenido`);
        } catch (error) {
          console.log(`OHHHHH nooooooo!!!! borrado ${error}`);
        }
      }
}

module.exports = ContenedorArchivo
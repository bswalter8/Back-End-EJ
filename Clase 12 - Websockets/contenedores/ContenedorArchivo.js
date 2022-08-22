const fs = require("fs");

class ContenedorArchivo {
    constructor(archivo) {
      this.archivoNombre = archivo;
      this.id;
    }
  
    async save(producto) {
      try {
        let contenidoLeido = [];
        let contenido = await fs.promises.readFile(this.archivoNombre, "utf-8");
      //  let nuevaID;
      //  if (contenido != "") {
       if (contenido !='')  {contenidoLeido = JSON.parse(contenido)} 
        //  nuevaID = contenidoLeido.length + 1;
        //  contenidoLeido.push({ ...producto, id: nuevaID });
          contenidoLeido.push({ ...producto });
       // } else {
         // nuevaID = 1;
         // contenidoLeido = [{ ...producto, id: nuevaID }];
      //  }
        try {
          const write = await fs.promises.writeFile(this.archivoNombre,JSON.stringify(contenidoLeido),"utf-8");
        //  return nuevaID;
        } catch (error) {
          console.log(`OHHHHH nooooooo!!!! ${error}`);
        }
        } catch (error) {
        console.log(`OHHHHH nooooooo!!!! ${error}`);
      }
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
          await fs.promises.writeFile(
            this.archivoNombre,
            JSON.stringify(contenidoLeido),
            "utf-8"
          );
          console.log(`Se ha borrado el elemento con ID: ${id_Requerida}`);
        } catch (error) {
          console.log(`OHHHHH nooooooo!!!! borrado ${error}`);
        }
      } catch (error) {
        console.log(`OHHHHH nooooooo!!!! ${error}`);
      }
    }
  
    async getAll() {
      try {
        let id;
        let contenidoLeido = [];
        let contenido = await fs.promises.readFile(this.archivoNombre, "utf-8");
        if (contenido != ''){
            contenidoLeido = JSON.parse(contenido);}
      
        return contenidoLeido;
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
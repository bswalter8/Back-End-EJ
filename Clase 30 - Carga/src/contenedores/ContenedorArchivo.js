import { promises } from "fs";
const { readFile, writeFile } = promises;

class ContenedorArchivo {
  
    constructor(archivo) {
      this.archivoNombre = archivo;
    //  this.id;
    }
  
    async save(elem) {
      const elems = await this.getAll()

      let newId
      if (elems.length == 0) {
          newId = 1
      } else {
          newId = elems[elems.length - 1].id + 1
      }

      const newElem = { ...elem, id: newId }
      elems.push(newElem)

      try {
          await writeFile(this.archivoNombre, JSON.stringify(elems),"utf-8");
          
          return newId
      } catch (error) {
          throw new Error(`Error al guardar: ${error}`)
      }
    }
  
    async getById(id_Requerida) {
      try {
        let id = null;
        let contenidoLeido = [];
        let contenido = await readFile(this.archivoNombre, "utf-8");
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
  
        let contenido = await readFile(this.archivoNombre, "utf-8");
        contenidoLeido = JSON.parse(contenido);
  
        contenidoLeido.forEach((element, i) => {
          if (element.id == id_Requerida) {
            contenidoLeido.splice(i, 1);
          }
        });
  
        try {
          await writeFile(
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
        let contenido = await readFile(this.archivoNombre, "utf-8");
        if (contenido != ''){
            contenidoLeido = JSON.parse(contenido);}
      
        return contenidoLeido;
      } catch (error) {
        console.log(`OHHHHH nooooooo!!!! no puede leer ${error}, ${this.archivoNombre}`);
      }
    }
  
    async deleteAll() {
      try {
        await writeFile(this.archivoNombre, "", "utf-8");
        console.log(`Se ha borrado todo el contenido`);
      } catch (error) {
        console.log(`OHHHHH nooooooo!!!! borrado ${error}`);
      }
    }
  }

export default ContenedorArchivo
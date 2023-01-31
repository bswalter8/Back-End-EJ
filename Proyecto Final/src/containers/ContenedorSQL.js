class ContenedorMemoria {
    constructor() {
        this.productos = [];
        this.id = 0;
      }
    
      async getById(id) {
        for (let producto of this.productos) {
          if (producto.id == id) {
            return producto;
          }
        }
        return { error: "producto no encontrado" };
      }
    
      async getAll() {
        return this.productos;
      }
    
      async save(prod,addID) {
        let prodAdd;
        if(addID)
        {
            let idIndex = this.productos.length;
            idIndex == 0? this.id = 0 : this.id = this.productos[idIndex-1].id;
            this.id++;
            prodAdd = { ...prod, id: this.id };
        } else {
            prodAdd = { ...prod};
        }
        this.productos.push(prodAdd);
        return prodAdd;
      }
    
      async update(prod, id) {
        for (let [index, producto] of this.productos.entries()) {
          if (producto.id == id) {
            let idAct = parseInt(id);
            this.productos[index] = { ...prod, id: idAct };
            return { confirmado: "producto actualizado" };
          }
        }
    
        return { error: "producto no encontrado. Imposible actualizar" };
      }
    
      async delete(id) {
        for (let i = 0; i < this.productos.length; i++) {
          if (this.productos[i].id == id) {
            this.productos.splice(i, 1);
            return { confirmado: "elemento elminado" };
          }
        }
        return { error: "producto no encontrado. Imposible eleminar" };
      }
    
      async deleteAll() {
        this.productos.splice(0, this.productos.length);
      }
   

      



}

export default ContenedorMemoria

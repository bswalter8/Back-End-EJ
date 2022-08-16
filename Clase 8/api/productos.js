


class ProductosApi {
  constructor() {
    this.productos = [];
    this.id = 0;
  }

  async listar(id) {
    for (let producto of this.productos) {
      if (producto.id == id) {
        return producto;
      }
    }
    return { error: "producto no encontrado" };
  }

  async listarAll() {
    return this.productos;
  }

  async guardar(prod) {
    this.id++;
    let prodAdd = { ...prod, id: this.id };
    this.productos.push(prodAdd);
    return prodAdd;
  }

  async actualizar(prod, id) {
    for (let [index, producto] of this.productos.entries()) {
      if (producto.id == id) {
        let idAct = parseInt(id);
        this.productos[index] = { ...prod, id: idAct };
        return { confirmado: "producto actualizado" };
      }
    }

    return { error: "producto no encontrado. Imposible actualizar" };
  }

  async borrar(id) {    
    for (let i=0; i<this.productos.length; i++){
        if (this.productos[i].id == id) {
            this.productos.splice(i, 1);
            return { confirmado: "elemento elminado" };
          } 
    }
    return { error: "producto no encontrado. Imposible eleminar" };
  }
}

module.exports = ProductosApi;

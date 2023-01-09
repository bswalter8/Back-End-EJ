export default class Producto {
    #id
    #title
    #price
    #thumbnail

    constructor(producto) {
        console.log(producto.title)
        this.id = producto._id;
      this.title = producto.title;
     /*    this.price = producto.price;*/
      // this.thumbnail = thumbnail;
    }

 /*   get id() { return this.#id }

    set id(id) {
        if (!id) throw new Error('"id" es un campo requerido')
        this.#id = id
    }

    get name() { return this.#name }

    set name(name) {
        if (!name) throw new Error('"nombre" es un campo requerido')
        this.#name = name
    }

    get price() { return this.#price }

    set price(price) {
        if (!price) throw new Error('"precio" es un campo requerido')
        this.#price = price
    }

    get thumbnail() { return this.#thumbnail }

    set thumbnail(thumbnail) {
        if (!thumbnail) throw new Error('"thumbnail" es un campo requerido')     
        this.#thumbnail = thumbnail
    } */
}
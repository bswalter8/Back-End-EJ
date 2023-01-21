export default class CarritoDto {
    constructor({ _id, idUser, timestamp, products, cantidad, delivery }) {
        this.id = _id;
        this.idUser = idUser;
        this.timestamp = timestamp;
        this.products = products;
        this.cantidad = cantidad;
        this.delivery = delivery;
    }
}

export function asDto(prod) {
  
    if (Array.isArray(prod))
        return prod.map(p => new CarritoDto(p))
    else
        return new CarritoDto(prod)
} 



export default class productoDto {
    constructor({ id, title, price, thumbnail }) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
    }
}

export function asDto(prod) {
  
    if (Array.isArray(prod))
        return prod.map(p => new productoDto(p))
    else
        return new productoDto(prod)
} 




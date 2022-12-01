export default class productoDto {
    constructor({ id, name, price, thumbnail }) {
        this.id = id;
        this.name = name;
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




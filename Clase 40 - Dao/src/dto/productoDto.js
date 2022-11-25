export default class productoDto {
    constructor({ id, nombre, apellido, dni }) {
        this.id = id;
        this.name = nombre;
        this.price = precio;
        this.thumbnail = thumbnail;
    }
}

export function asDto(pers) {
    if (Array.isArray(pers))
        return pers.map(p => new PersonaDto(p))
    else
        return new PersonaDto(pers)
} 




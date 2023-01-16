export default class MensajeDto {
    constructor({ email, nombre, apellido, edad, alias,avatar,text }) {
       // this.id = id;
        this.email = email;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.alias = alias;
        this.avatar = avatar;
        this.author = author;
        this.text = text;
        this.fyh = fyh;
    }
}

export function asDto(men) {
    if (Array.isArray(men))
        return men.map(p => new MensajeDto(p))
    else
        return new MensajeDto(men)
} 




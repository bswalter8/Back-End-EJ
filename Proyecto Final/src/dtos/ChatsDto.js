export default class MensajeDto {
    constructor({ idUser, tipo, email, text, fechahora }) {
        this.idUser = idUser;
        this.tipo = tipo;
        this.email = email;
        this.text = text;
        this.fechahora = fechahora;
    }
}

export function asDto(men) {
    if (Array.isArray(men))
        return men.map(p => new MensajeDto(p))
    else
        return new MensajeDto(men)
} 


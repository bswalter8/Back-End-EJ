
import contenedorDaoFactory from '../daos/contenedorDaoFactory.js'


export default class RepoProductos {
    #dao;

    constructor() {
        this.#dao = contenedorDaoFactory.getDao('MariaDB');
    }

    async getAll() {
  //      console.log(this.#dao.getAll())
        const personas = await this.#dao.getAll();
        return personas
    }

    async getById(idBuscado) {
        const dto = await this.#dao.getById(idBuscado)
        return new dto
    }

    async add(personaNueva) {
        await this.#dao.save(personaNueva)
    }

    async removeById(idBuscado) {
        const removida = await this.#dao.deleteById(idBuscado)
        return removida
    }

    async removeAll() {
        await this.#dao.deleteAll()
    }
}
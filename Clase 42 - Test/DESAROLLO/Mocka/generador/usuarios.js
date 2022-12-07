import { faker } from '@faker-js/faker';
faker.locale = 'es';


const precio = Math.round(faker.commerce.price());

function generar() {
    return {
        title: faker.commerce.productName(),
        price: precio,
        thumbnail: 'https://img.freepik.com/vector-premium/linda-regla-divertida-agitando-personaje-mano_464314-1633.jpg?w=740l'
    }
};

export {
    generar
}
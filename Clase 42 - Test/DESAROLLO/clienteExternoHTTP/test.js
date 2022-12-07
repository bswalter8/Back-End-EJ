import { testGET, testPOST, testPUT, testDELETE } from "./axios.js";


const host = 'http://localhost:8080';

const testRandom = Math.floor(Math.random() * 100);

const payload = {
    "title": `Test${testRandom}`,
    "price": 300,
    "thumbnail" : "https://img.freepik.com/vector-premium/linda-regla-divertida-agitando-personaje-mano_464314-1633.jpg?w=740l"
}

const payloadPUT = {
    "title": `Testeo PUT`,
    "price": 300,
    "thumbnail" : "https://img.freepik.com/vector-premium/linda-regla-divertida-agitando-personaje-mano_464314-1633.jpg?w=740l"
}

console.log('TEST de funcion GET:')
console.log(await testGET(`${host}/api/productos`))

console.log('TEST de funcion POST:')
console.log(await testPOST(`${host}/api/productos`, payload))

console.log('TEST de funcion PUT:')
console.log(await testPUT(`${host}/api/productos/636d487b89dd6e16950aac87`, payloadPUT))

console.log('TEST de funcion DELETE:')
console.log(await testDELETE(`${host}/api/productos/636d487b89dd6e16950aac87`))
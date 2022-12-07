import mongoose from 'mongoose';
import supertest from 'supertest';
import { expect } from 'chai';
//import app from '../src/main.js';
import { generar } from './generador/usuarios.js';
import express from 'express'

let request;
let server;

const app = express();



describe('test api rest full', () => {
    before(async function () {
        await connectDb();
        server = await startServer();
        request = supertest(`http://localhost:8080/api/productos`);
    });

    after(function () {
        mongoose.disconnect();
        server.close();
    });

   describe('GET', () => {
        it('debería retornar un status 200', async () => {
            const response = await request.get('/')
            expect(response.status).to.eq(200);
        })
    });
 
    describe('POST', () => {
        it('debeería incoporar un producto', async () => {
       
            const producto = generar();
        
            const response = await request.post('/').send(producto);
    
            expect(response.status).to.eq(200);

            const res = response.body;
            expect(res).to.include.keys('title', 'price', 'thumbnail');
            expect(res.title).to.eq(producto.title);
            expect(res.price).to.eq(producto.price);
            expect(res.thumbnail).to.eq(producto.thumbnail);
        })
    })

    describe('PUT', () => {

        it('debeería actualizar un producto', async () => {
            const producto = generar();
            
            const response = await request.put('/636d487b89dd6e16950aac87').send(producto);
    
            expect(response.status).to.eq(200);

            const res = response.body;
            expect(res.update).to.eq(true);

        })
    })

    describe('DELETE', () => {

        it('debeería borrar un producto', async () => {

            
            const response = await request.delete('/6390f4de64ead316a38e3939');
    
            expect(response.status).to.eq(200);

            const res = response.body;
            expect(res.delete).to.eq(true);

        })
    })
});




async function connectDb() {
    try {
        await mongoose.connect('mongodb+srv://kind59:H1Xm53ciKkBDdui2@cluster0.k5efrwt.mongodb.net/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('Base de datos conectada!');
    } catch (error) {
        throw new Error(`Error de conexión en la base de datos: ${err}`)
    }
}

async function startServer() {
    return new Promise((resolve, reject) => {
        const PORT = 0
        const server = app.listen(PORT, () => {
            console.log(`Servidor express escuchando en el puerto ${server.address().port}`);
            resolve(server)
        });
        server.on('error', error => {
            console.log(`Error en Servidor: ${error}`)
            reject(error)
        });
    })
}
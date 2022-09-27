import express from 'express'
import knex from 'knex';

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import { Server as IOserver } from 'socket.io'
import { normalize, denormalize, schema } from 'normalizr';
import util from "util"

//const handlebars = require('express-handlebars');
import handlebars  from 'express-handlebars'


import ContenedorDB from './contenedores/ContenedorDB.js';
import ContenedorMongoDb from './contenedores/ContenedorMongoDb.js';
import MockData from "./contenedores/ContenedorMock.js";


import config from '../src/config.js'
import {createTablaMariaDB} from '../scripts/crearTablas.js'
import {createTablaSQLlite} from '../scripts/crearTablas.js'



//const productosDB = new ContenedorSQL(config,'Ej16');

//--------------------------------------------
// instancio servidor, socket y api
const app = express();
const { Router } = express
const httpServer = new HttpServer(app); 
const io = new IOserver(httpServer); 
const schemaNorma = normalize.schema;


//--------------------------------------------
// configuro router de productos 


const productosRouterTest = new Router()

productosRouterTest.get('/', async (req, res) => {
    const productosAll = await MockData();
    res.send(productosAll);
})

//--------------------------------------------
// configuro schema 

const authorSchema = new schema.Entity('author', {}, {idAttribute: 'email'});

const messageSchema = new schema.Entity('text', {author: authorSchema}, {idAttribute: 'id'});

 const postSchema = new schema.Entity(
     'posts', 
     {
     mensajes: [messageSchema]
     },
     {idAttribute: 'id'} 
 );

const msgNormalized= (msgs) =>{   
  if(msgs.length !== 0){
      let i = 0;
      const nuevoArray = msgs.map( doc => {
          i++
          const obj = { id: i, author: doc.author, text: doc.text }
          return obj;
      });
      print(nuevoArray)
      const normalizedMsg = normalize( nuevoArray , [postSchema]);
  return normalizedMsg;
  }
}



//--------------------------------------------
// configuro el socket

createTablaMariaDB('Ej16');
createTablaSQLlite('ecommerce');
const productosDB = new ContenedorDB(config.mariaDb,'Ej16');
const chatDB = new ContenedorDB(config.sqlite3,'ecommerce');
const mongoDB = new ContenedorMongoDb('msg-chat');


function print(objeto) {
    console.log(util.inspect(objeto, false, 12, true));
}


io.on('connection', async socket => {
    console.log('Nuevo cliente conectado');
    //Lee el archivo y vuelve a mandar productos por socket

    let productosLeidos = await productosDB.listarAll();
   
   // productos.push(...productosLeidos);   
    io.sockets.emit('productos', productosLeidos);
    
    let chatsLeidos = await chatDB.listarAll();
    io.sockets.emit('mensajes', chatsLeidos);

    socket.on('new-product', async data =>{   
         await productosDB.guardar(data);
         productosLeidos = await productosDB.listarAll();
         io.sockets.emit('productos',productosLeidos);
    })

    socket.on('new-msg', async data =>{

        await mongoDB.add(data);
        let msgs = await mongoDB.getAll();
        const normalizedMsg = msgNormalized(msgs)
        chatsLeidos = await chatDB.listarAll();
        io.sockets.emit('mensajes',chatsLeidos);
        print(normalizedMsg);
   })
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        defaultLayout: 'tabla-productos.hbs',
        layoutsDir:  './public/plantillas',
        partialsDir:  '../views/partials'
    })
);
app.set('view engine', 'hbs');
app.set('views', '../views');


//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


app.use('/api/productos-test', productosRouterTest)


//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

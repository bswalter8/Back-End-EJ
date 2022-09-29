import express from 'express'
import knex from 'knex';
import config from './config.js'
import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import { Server as IOserver } from 'socket.io'
import { normalize, denormalize, schema } from 'normalizr';
import util from "util"

//const handlebars = require('express-handlebars');
import handlebars  from 'express-handlebars'


import ContenedorDB from './contenedores/ContenedorDB.js';
import ContenedorMongoDb from './contenedores/ContenedorMongoDb.js';
import ContenedorArchivo from './contenedores/ContenedorArchivo.js';
import MockData from "./contenedores/ContenedorMock.js";


//import config from '../src/config.js'
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

// Definimos un esquema de autor
const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'email' });

// Definimos un esquema de mensaje
const schemaMensaje = new schema.Entity('post', { author: schemaAuthor }, { idAttribute: 'id' })

// Definimos un esquema de posts
const schemaMensajes = new schema.Entity('posts', { mensajes: [schemaMensaje] }, { idAttribute: 'id' })

const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, schemaMensajes)

//const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, schemaMensajes)
/*const msgNormalized= (msgs) =>{   
   let nuevoArray = [] 
  if(msgs.length !== 0){
      let i = 0;
       nuevoArray = msgs.map( doc => {
          i++
          const obj = { idText: i, author: doc.author, text: doc.text }
          return obj;
      });
      
      const normalizedMsg = normalize(  nuevoArray , [schemaMensajes]);
      print(normalizedMsg)
  return normalizedMsg;
  }
}
*/





//--------------------------------------------
// configuro el socket

//createTablaMariaDB('Ej16');
//createTablaSQLlite('ecommerce');
const productosDB = new ContenedorDB(config.mariaDb,'Ej16');
const mensajesApi = new ContenedorArchivo(`${config.fileSystem.path}/mensajes.json`)
//const chatDB = new ContenedorDB(config.sqlite3,'ecommerce');
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
    
    socket.on('new-product', async data =>{   
         await productosDB.guardar(data);
         productosLeidos = await productosDB.listarAll();
         io.sockets.emit('productos',productosLeidos);
    })

    // carga inicial de mensajes
    socket.emit('mensajes', await listarMensajesNormalizados());

    // actualizacion de mensajes
    socket.on('nuevoMensaje', async mensaje => {
        mensaje.fyh = new Date().toLocaleString()
        await mensajesApi.save(mensaje)
   
        io.sockets.emit('mensajes', await listarMensajesNormalizados());
    })
});


async function listarMensajesNormalizados() {
    const mensajes = await mensajesApi.getAll()
    const normalizados = normalizarMensajes({ id: 'mensajes', mensajes })
    print(normalizados)
    return normalizados
}


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

import express from 'express'
import knex from 'knex';
import config from './config.js'
import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import { Server as IOserver } from 'socket.io'
import { normalize, denormalize, schema } from 'normalizr';
import util from "util"
import session from 'express-session';
import path from 'path';
import MongoStore from 'connect-mongo';
import { fileURLToPath } from 'url';


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
// instancio servidor, socket y api, filename
const app = express();
const { Router } = express
const httpServer = new HttpServer(app); 
const io = new IOserver(httpServer); 
const schemaNorma = normalize.schema;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true }

//--------------------------------------------
// configuro router de productos 


const productosRouterTest = new Router()

productosRouterTest.get('/', async (req, res) => {
    const productosAll = await MockData();
    res.send(productosAll);
})
//--------------------------------------------
// configuro session 



app.use(session({
    store:MongoStore.create({ mongoUrl: 'mongodb+srv://kind59:H1Xm53ciKkBDdui2@cluster0.k5efrwt.mongodb.net/test', mongoOptions }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}));

//--------------------------------------------
// configuro schema 

// Definimos un esquema de autor
const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'email' });

// Definimos un esquema de mensaje
const schemaMensaje = new schema.Entity('post', { author: schemaAuthor }, { idAttribute: 'id' })

// Definimos un esquema de posts
const schemaMensajes = new schema.Entity('posts', { mensajes: [schemaMensaje] }, { idAttribute: 'id' })

const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, schemaMensajes)




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
app.set('view engine', 'ejs');
/*app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        defaultLayout: 'main.hbs',
        layoutsDir:  './public/plantillas',
     //   partialsDir:  '../views/partials'
    })
);*/
//app.set('view engine', 'hbs');
//app.set('views', path.join(__dirname, '../public/plantillas'));
app.set('views', path.join(__dirname, '../views'));


//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


app.use('/api/productos-test', productosRouterTest)

//--------------------------------------------
// Login
app.get('/', async (req, res) => {
    
    if (req.session.nombre) {
      res.redirect('/user');
     
    } else {
        res.redirect('/login');
    }
});

app.get('/login', async (req, res) => {
  //  res.sendFile(path.join(__dirname, '../public/login.html'));
     res.sendFile(path.join(__dirname, '../views/login.html'));
});



app.post('/login', async (req, res) => {
    
    const { nombre } = req.body;

    req.session.nombre = nombre;
    req.session.contador = 0;
    res.redirect('/user');

});

app.get('/user', async (req, res) => {
    if (req.session.nombre) {
        req.session.contador++;
        await res.render('pages/home', {
            nombre: req.session.nombre,
            contador: req.session.contador
        })
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        res.redirect('/login');
    });
});





//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

import express from 'express'
import knex from 'knex';
import config from './config.js'

import mongoose from 'mongoose';
import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import { Server as IOserver } from 'socket.io'
import { normalize, denormalize, schema } from 'normalizr';
import util from "util"
import session from 'express-session';
import path from 'path';
import MongoStore from 'connect-mongo';
import User from './models.js';
import bCrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import yargs from 'yargs';

//const handlebars = require('express-handlebars');
import handlebars  from 'express-handlebars'


import ContenedorDB from './contenedores/ContenedorDB.js';
import ContenedorMongoDb from './contenedores/ContenedorMongoDb.js';
import ContenedorArchivo from './contenedores/ContenedorArchivo.js';
import MockData from "./contenedores/ContenedorMock.js";



import {createTablaMariaDB} from '../scripts/crearTablas.js'
import {createTablaSQLlite} from '../scripts/crearTablas.js'

//Rutas login
import {
    getRoot,
    getLogin,
    postLogin,
    getFailLogin,
    getLogout,
    getSignUp,
    postSignup,
    getFailsignup,
    getInfo,
    getCalc
} from './routes.js'
import controllersdb from './controllersdb.js'
import UserLogIn from './models.js';
import {fork} from 'child_process';




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const argsConsole = yargs(process.argv.slice(2)).default({
    port: 8080
  }).argv;

const port = argsConsole.port;
//---------------- Paspport ------------

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
},
    (req, username, password, done) => {
        User.findOne({ 'username': username }, (err, user) => {
            if (err) {
                return done(err);
            };

            if (user) {
                return done(null, false);
            }

            const newUser = {
                username: username,
                password: createHash(password),
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            };

            User.create(newUser, (err, userWithId) => {
                if (err) {
                    return done(err);
                }
                return done(null, userWithId);
            })
        });
    }
));

passport.use('login', new LocalStrategy(
    (username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (!isValidPassword(user, password)) {
                return done(null, false);
            }

            return done(null, user);
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, done);
});

function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
}



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

const infoRouter = new Router()


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
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        defaultLayout: 'main.hbs' ,
       
        partialsDir:  '../views/partials'
    })
);
app.set('view engine', 'hbs');
app.set('views', path.join(process.cwd(), './public/plantillas'));


//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


app.use('/api/productos-test', productosRouterTest);
app.use('/info', infoRouter)



//--------------------------------------------
// configuro router de login 


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: config.TIEMPO_EXPIRACION
    }
}));

app.use(passport.initialize());
app.use(passport.session());

infoRouter.get('/', getInfo);

app.get('/api/randoms', getCalc);

//LOGIN
app.get('/login', getLogin);
app.post('/login', passport.authenticate('login', {
    failureRedirect: '/faillogin'
}), postLogin);
app.get('/faillogin', getFailLogin);

//SIGNUP
app.get('/signup', getSignUp);
app.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/failsignup'
}), postSignup);
app.get('/failsignup',getFailsignup);

//Last part
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

app.get('/productos', checkAuthentication, (req, res) => {
    const { user } = req;
    console.log(user);
    res.send('<h1>Ruta OK!</h1>');
});

//LOGOUT
app.get('/logout', getLogout);


//--------------------------------------------
// inicio el servidor

const PORT = port;
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

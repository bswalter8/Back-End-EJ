
import { normalize, denormalize, schema } from 'normalizr';
import {loggerError} from '../logger/logger.js'
import util from "util";
import config from '../config/config.js';
//import ContenedorDB from '../repositories/ContenedorSQL.js';
import ContenedorMongoDb from '../repositories/ContenedorMongoDb.js';
//import ContenedorArchivo from '../repositories/ContenedorArchivo.js';*/
import { Server as IOserver } from 'socket.io'
import RepoProductos from '../repositories/repoProductos.js'
import RepoMensajes from '../repositories/repoMensajes.js'

const schemaNorma = normalize.schema;


//--------------------------------------------
// configuro schema 

// Definimos un esquema de autor
const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'email' });

// Definimos un esquema de mensaje
const schemaMensaje = new schema.Entity('post', { author: schemaAuthor }, { idAttribute: 'id' })

// Definimos un esquema de posts
const schemaMensajes = new schema.Entity('posts', { mensajes: [schemaMensaje] }, { idAttribute: 'id' })

const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, schemaMensajes)


const mongoDB = new ContenedorMongoDb('msg-chat');
//createTablaMariaDB('Ej16');
//createTablaSQLlite('ecommerce');
//const productosDB = new ContenedorDB(config.mariaDb,'Ej16');
//const mensajesApi = new ContenedorArchivo(`${config.fileSystem.path}/mensajes.json`)
//const chatDB = new ContenedorDB(config.sqlite3,'ecommerce');

const productosDB = new RepoProductos();
const mensajesApi = new RepoMensajes();



function print(objeto) {
    console.log(util.inspect(objeto, false, 12, true));
}


function socketOn(httpServer) {

    const io = new IOserver(httpServer); 

        try {
        
            io.on('connection', async socket => {
                console.log('Nuevo cliente conectado');
                //Lee el archivo y vuelve a mandar productos por socket

            let productosLeidos = await productosDB.getAll();    //Errrror acaaa 
            console.log(`Estos son los productos leidos; ${productosLeidos}`)
            // productos.push(...productosLeidos);   
            try{
                    io.sockets.emit('productos', productosLeidos);
                    
                    socket.on('new-product', async data =>{   
                        await productosDB.add(data);
                        productosLeidos = await productosDB.getAll();
                        io.sockets.emit('productos',productosLeidos);
                    })
                } catch (error){
                    loggerError(error);
                }

                try {
                // carga inicial de mensajes
                socket.emit('mensajes', await listarMensajesNormalizados());

                // actualizacion de mensajes
                socket.on('nuevoMensaje', async mensaje => {
                    mensaje.fyh = new Date().toLocaleString()
                    await mensajesApi.add(mensaje)
            
                    io.sockets.emit('mensajes', await listarMensajesNormalizados());
                })
                } catch (error){
                    loggerError(error);
                }

            });
        }
        catch (error){
            console.log(error)
            loggerError(error);
        }
}

async function listarMensajesNormalizados() {
    const mensajes = await mensajesApi.getAll()
    const normalizados = normalizarMensajes({ id: 'mensajes', mensajes })
    print(normalizados)
    return normalizados
}

export {socketOn}


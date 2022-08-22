const express = require('express');
const handlebars = require('express-handlebars');

const { Server: HttpServer } = require('http');
const { Server: Socket } = require('socket.io');
const {Server: IOserver} = require('socket.io');

const ContenedorMemoria = require('../contenedores/ContenedorMemoria.js')
const ContenedorArchivo = require('../contenedores/ContenedorArchivo.js')

const productosApi = new ContenedorMemoria();
const productosArchivo = new ContenedorArchivo('src/productos.txt');
const {productos} = productosApi;

const chatApi = new ContenedorMemoria();
const chatArchivo = new ContenedorArchivo('src/chat.txt');

//--------------------------------------------
// instancio servidor, socket y api
const app = express();
const httpServer = new HttpServer(app); 
const io = new IOserver(httpServer); 

//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado');
    //Lee el archivo y vuelve a mandar productos por socket
   
    productosApi.borrarAll();
    const productosLeidos = await productosArchivo.getAll();
    productos.push(...productosLeidos)   
    io.sockets.emit('productos', productos);

    chatApi.borrarAll();
    const chatsLeidos = await chatArchivo.getAll();
    chatApi.productos.push(...chatsLeidos);
    io.sockets.emit('mensajes', chatApi.productos);

    socket.on('new-product', async data =>{
         let productoAdd = await productosApi.guardar(data,true);
         console.log(productoAdd)
         await productosArchivo.save(productoAdd);
        io.sockets.emit('productos',productos);
    })
    socket.on('new-msg', async data =>{
        await chatApi.guardar(data,false);      
        await chatArchivo.save(data);
        io.sockets.emit('mensajes',chatApi.productos);
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
        defaultLayout: 'index.hbs',
        layoutsDir:  '../plantillas',
        partialsDir:  '../views/partials'
    })
);
app.set('view engine', 'hbs');
app.set('views', '../views');



//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

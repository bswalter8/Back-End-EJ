const express = require('express')

const ProductosApi = require('../api/productos.js')

const productosApi = new ProductosApi()
const {productos} = productosApi;


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('../public'))

//Set engine
app.set('views',  '../views');
app.set('view engine', 'ejs');

//--------------------------------------------

app.post('/productos', async (req, res) => {
   await  productosApi.guardar(req.body);
 
     res.redirect('/');
})

app.get('/productos', async (req, res) => {
    await res.render('vista', { productos });
});


//--------------------------------------------
const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

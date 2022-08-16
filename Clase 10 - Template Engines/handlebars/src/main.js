const express = require('express');
const handlebars = require('express-handlebars');
const ProductosApi = require('../api/productos.js')

const productosApi = new ProductosApi()
const {productos} = productosApi;
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('../public'))

app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir:  '../views/layouts',
        partialsDir:  '../views/partials'
    })
);
app.set('view engine', 'hbs');
app.set('views', '../views');



//--------------------------------------------



app.post('/productos', async (req, res) => {
    await  productosApi.guardar(req.body);
      res.redirect('/');
 })

app.get('/productos', async (req, res) => {
    await res.render('vista', { productos: productos});
});

//--------------------------------------------
const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

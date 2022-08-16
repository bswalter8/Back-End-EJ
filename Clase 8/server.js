const express = require('express')
const { Router } = express
const ProductosApi = require('./api/productos.js')

// router de productos

const productosApi = new ProductosApi()

const productosRouter = new Router()

productosRouter.use(express.json())
productosRouter.use(express.urlencoded({ extended: true }))




//rutas usando productosRouter

productosRouter.get("/productos", async (req,res)=>{
    const respuesta = await productosApi.listarAll();
    res.json(respuesta)
 })

 productosRouter.get("/productos/:id", async (req,res)=>{
    const respuesta =  await productosApi.listar(req.params.id);
    res.json(respuesta)
     
})

productosRouter.post("/productos/", async (req,res)=>{
    const respuesta = await productosApi.guardar(req.body);
    res.json(respuesta);    
})
productosRouter.put("/productos/:id", async (req,res)=>{
    const respuesta = await productosApi.actualizar(req.body,req.params.id);
    res.json(respuesta);    
})
productosRouter.delete("/productos/:id", async (req,res)=>{
    const respuesta = await productosApi.borrar(req.params.id);
    res.json(respuesta);    
})

// servidor

const app = express()
app.use(express.static('public'))

app.use('/api', productosRouter)


const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

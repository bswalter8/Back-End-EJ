const express = require('express')
const { Router } = express

const ContenedorArchivo = require('./contenedores/ContenedorArchivo.js')

//--------------------------------------------
// instancio servidor y persistencia

const app = express();

const productosApi = new ContenedorArchivo('../dbProductos.json')
const carritosApi = new ContenedorArchivo('../dbCarritos.json')

//--------------------------------------------
// permisos de administrador

const esAdmin = true


const timeStamp = () =>{
    
}

function crearErrorNoEsAdmin(ruta, metodo) {
    const error = {
        error: -1,
    }
    if (ruta && metodo) {
        error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
    } else {
        error.descripcion = 'no autorizado'
    }
    return error
}

function soloAdmins(req, res, next) {
    if (!esAdmin) {
        res.json(crearErrorNoEsAdmin())
    } else {
        next()
    }
}

//--------------------------------------------
// configuro router de productos

const productosRouter = new Router();

productosRouter.get("/", async (req,res)=>{
    const respuesta = await productosApi.getAll();   
    res.json(respuesta);
 })

 productosRouter.get("/:id", async (req,res)=>{
    const respuesta =  await productosApi.getById(req.params.id);
    console.log(req.params.id);
    res.json(respuesta);    
})

productosRouter.post("/", soloAdmins, async (req,res)=>{
    const respuesta = await productosApi.save(req.body);
    res.json(respuesta);    
})
productosRouter.put("/:id", soloAdmins, async (req,res)=>{
    const respuesta = await productosApi.actualizar(req.body,req.params.id);
    res.json(respuesta);    
})
productosRouter.delete("/:id", soloAdmins,async (req,res)=>{
    let respuesta = await productosApi.getAll();
    if (respuesta.length != 1){
        respuesta = await productosApi.deleteById(req.params.id);
    } else {
        respuesta = await productosApi.deleteAll();    
    }
    res.json(respuesta);    
})



//--------------------------------------------
// configuro router de carritos

const carritosRouter = new Router();

carritosRouter.get('/:id/productos', async (req,res)=>{
    const carrito = await carritosApi.getById(req.params.id);
    const respuesta = carrito.productos;
    res.json(respuesta);    
})


carritosRouter.post("/", async (req,res)=>{
    const respuesta = await carritosApi.save();
    res.json(respuesta);    
})

carritosRouter.post('/:id/productos', async (req,res)=>{
    const carrito = await carritosApi.getById(req.params.id);
    let d = new Date();
    let  timeStamp = d.toLocaleTimeString();
    let nuevoProducto = {...req.body, timeStamp}
    if(carrito.productos == null){
        carrito.productos = []
        carrito.productos.push(nuevoProducto);
    } else {
        carrito.productos.push(nuevoProducto);
    }
    const respuesta = await carritosApi.actualizar(carrito,req.params.id);
    res.json(respuesta);    
})

carritosRouter.delete("/:id",async (req,res)=>{
    const carrito = await carritosApi.getAll();
    let respuesta ;
    if (carrito.length != 1){
        respuesta = await carritosApi.deleteById(req.params.id);
    } else {
        respuesta = await carritosApi.deleteAll();    
    }
    res.json(respuesta);    
})

carritosRouter.delete('/:id/productos/:id_prod', async (req,res)=>{
    const carrito = await carritosApi.getById(req.params.id);
    carrito.productos.forEach((element, i) => {
        if (element.id == req.params.id_prod) {
            carrito.productos.splice(i, 1);
        }
      });
    const respuesta = await carritosApi.actualizar(carrito,req.params.id);
    res.json(respuesta);    
})

//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('../public'))
 


app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

module.exports = app
const Contenedor = require("./contenedor");
const express = require("express");

async function main() {
  
  const manejoArchivo = new Contenedor("productos.txt");
  const nuevosProductos = [
    {
      "title": "Escuadra",
      "price": 123.45,
      "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
    },
    {
      "title": "Calculadora",
      "price": 234.56,
      "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
    },
    {
      "title": "Globo Terráqueo",
      "price": 345.67,
      "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png"
    },
    {
      "title": "Goma",
      "price": 23.45,
      "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
    },
    {
      "title": "Lapicera",
      "price": 634.56,
      "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
    },
    {
      "title": "Regla",
      "price": 345.67,
      "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",

    }
   ]

  await manejoArchivo.deleteAll();
   
   async function agregaProducos() {
    for (let item of nuevosProductos) {
      const agregado = await manejoArchivo.save(item);
      console.log(`Se ha agragado el producto: ${agregado}`); 
    }
 }

await agregaProducos();
console.log('Ha agregado todos los productos, iniciando el servidor')
  const app = express();
  app.get("/", (req, res) => {
    res.send('<h1 style="color:red"›>Bienvenidos al Ejercicio con Servidor Express</h1>');
  });


  app.get("/productos", async (req, res) => {
    const productos = await manejoArchivo.getAll();
     res.send( productos);
  });

  app.get("/productosRandom", async (req, res) => {
    const productos = await manejoArchivo.getAll();
    let randomNumber = Math.floor(Math.random() * productos.length);
    res.send(await manejoArchivo.getById(randomNumber+1));
  });

  const server = app.listen(8080, () => {
    console.log(
      `Servidor http escuchando en el puerto ${server.address().port}`
    );
  });

  server.on("error", (error) => console.log(`error ${error}`));
}

main();



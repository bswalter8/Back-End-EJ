const Contenedor = require('./Contenedor')

let libro1 = {
  nombre: "En busca del tiempo perdido",
  autor: "Marcel Proust",
  precio: 900,
};

let libro2 = {
  nombre: "Crimen y Castigo",
  autor: "F. Dostoyevski",
  precio: 200,
};
let libro3 = {
  nombre: "Hamlet",
  autor: "W. Shakespeare",
  precio: 300,
};

let libro4 = {
  nombre: "Orgullo y Prejuicio",
  autor: 'J, Austen',
  precio: 100,
};



async function main(){
    let idLibroSave;
    const manejoArchivo = new Contenedor("productos.txt");
    console.log('-----Registrando libros en la base de datos:----')
    idLibroSave = await manejoArchivo.save(libro1);
    console.log(`Libro guardado con ID:${idLibroSave}`)
    idLibroSave = await manejoArchivo.save(libro2);
    console.log(`Libro guardado con ID:${idLibroSave}`)
    idLibroSave = await manejoArchivo.save(libro3);
    console.log(`Libro guardado con ID:${idLibroSave}`)
    idLibroSave = await manejoArchivo.save(libro4);
    console.log(`Libro guardado con ID:${idLibroSave}`)
    console.log('----Consulta por el libro con ID 2:----')
    let libroBuscado = await manejoArchivo.getById(2);
    libroBuscado === null? console.log('ID no encontrado'):console.log(libroBuscado); 
    console.log('----Consulta por el libro con ID 7:----')
    libroBuscado = await manejoArchivo.getById(7);
    libroBuscado === null? console.log('ID no encontrado'):console.log(libroBuscado);   
    console.log('----Borra  el libro con ID 2:----')
     await manejoArchivo.deleteById(2);
    console.log('----Consulta por todos los libros de la base de datos----')
    const todosLibros = await manejoArchivo.getAll();
    console.log(todosLibros); 
    console.log('----Borra toda la base de datos----')
    await manejoArchivo.deleteAll();
}

main();

    
    








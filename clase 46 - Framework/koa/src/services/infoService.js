import { fork } from 'child_process';
import { cpus } from "os";
import { stringify } from 'querystring';


//const forked = fork('./src/randoms.js');

const getInfoWithConsoleLog = async (req, res) => {

    const respuesta = {
        Argumentos_de_entrada: process.argv,
        Nombre_de_la_plataforma: process.platform,
        Versión_de_node: process.version,                                               
        Memoria_total_reservada: process.memoryUsage(),
        Carpeta_del_proyecto: process.cwd(),
        Process_id: process.pid,
        Path_de_ejecución: process.execPath,
        Procesadores: cpus().length
    }
    res.json(respuesta)
    console.log(JSON.stringify(respuesta))
}

const getInfo = async (req, res) => {

    const respuesta = {
        Argumentos_de_entrada: process.argv,
        Nombre_de_la_plataforma: process.platform,
        Versión_de_node: process.version,                                               
        Memoria_total_reservada: process.memoryUsage(),
        Carpeta_del_proyecto: process.cwd(),
        Process_id: process.pid,
        Path_de_ejecución: process.execPath,
        Procesadores: cpus().length
    }
    res.json(respuesta)
}


const productos = (req,res) =>{
    const { user } = req;
    // console.log(user);
     res.send('<h1>Ruta OK!</h1>');   
}



const getCalc = (req, res) => {
    const cant = req.query.cant ? Number(req.query.cant) : 0;
/*        console.log(cant)
      forked.send({mensaje: cant})  
      forked.on('message', msg => {
        const num = JSON.stringify(msg)
        res.end(num);
    })*/
    res.end(cant);
}

export { getInfo,
    getInfoWithConsoleLog,
    getCalc, productos}
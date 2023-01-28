
import RepoChats from '../repositories/repoChats.js';
import { Server } from "socket.io";


const mensajesDB = await new RepoChats();


const socketOn = (expressServer) => {
    const io = new Server(expressServer,{
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
  
    console.log('Socket Chat conectado')
    io.on("connection", async (socket) => {
      console.log("Se conecto un usuario nuevo al chat", socket.id);
  
      let arrayMsj = await mensajesDB.getAll();
      socket.emit("server:msgs", arrayMsj);
  
      socket.on("client:msgs", async (msgInfo) => {
        console.log(msgInfo)
        const msgsSend = await mensajesDB.add(msgInfo);
   
        let arrayMsj = await mensajesDB.getAll();
        socket.emit("server:msgs", arrayMsj);
      });
    });
  };



export {socketOn}


 const obj = {};


 process.on('message', (msg) => {
     try{
     
       const min = 1;
         const max = 1000;
         const cantidadCal = 0;
         msg.mensaje !== 0 ?   cantidadCal = 1e8 :  cantidadCal = msg.mensaje;
        
         for(let i=0; i < cantidadCal; i++){
            const random = Math.floor((Math.random() * (max - min + 1)) + min);
            if(obj[random]){
                obj[random] += 1
            }else{
                obj[random] = 1
            }
        }
        process.send(obj);
        process.exit();
   
     }catch(error){
         console.log(`error salida del fork hijo: ${error}`);
     }
     process.exit();
 });

 process.send(obj); 






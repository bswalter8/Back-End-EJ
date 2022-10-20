 const obj = {};


  process.on('message', (msg) => {

    if (msg) {
        console.log('Child process received START message');
  
   
    try{
      
       const min = 1;
         const max = 1000;
         let cantidadCal = 0;
         msg.mensaje !== 0 ?   cantidadCal = msg.mensaje :  cantidadCal = 1e8;
        
         for(let i=0; i < cantidadCal; i++){
            const random = Math.floor((Math.random() * (max - min + 1)) + min);
            if(obj[random]){
                obj[random] += 1
            }else{
                obj[random] = 1
            }
        }
        console.log(obj)
        process.send(obj);
        
         //  process.exit();
   
     }catch(error){
         console.log(`error salida del fork hijo: ${error}`);
     }
  //  process.exit();
    }
 });










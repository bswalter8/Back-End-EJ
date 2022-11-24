import { faker } from '@faker-js/faker';

 const getProducts = async () => {
     try{
         const products = [];

         for(let i=0; i < 5; i++){
             const product = {
                 title: faker.commerce.product(),
                 thumbnail: faker.image.imageUrl(640, 480, true),
                 price: faker.commerce.price(),
                 hasAny: true
             }
             products.push(product);
         }
         return products;
     }catch(e){
         console.log( `se produjo el siguiente error: ${e}`);
         res.sendStatus(500)
     }
 }
 export  {getProducts};



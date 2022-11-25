import {getProducts} from '../repositories/ContenedorMock.js'

 const  mockData = async (req,res) =>{
    const productosAll = await getProducts();                          
    res.send(productosAll);
}

export {mockData};
import express from 'express';
import { ProductManager } from './ProductManager.mjs';

const server = express();

const productList = new ProductManager('./productList.json')

server.get('/products', async (req,res)=>{
    try {
        const limit = +req.query.limit; // Convierte el valor a número usando +
        const list = await productList.getProducts();
        
        if (!isNaN(limit)) { // Verificamos si es un numero, devolvera true
            let result;
            if(limit > list.length){
                res.send(`<h1 style="color:red;text-align:center">Limite Excedido</h1>`)
            }else{
                result = list.slice(0, limit);
                res.send(result)
            }

        } else {
            res.send(list);
        }
    } catch (error) {
        res.send(error);
    }
    
});
server.get('/products/:productId', async (req,res)=>{
    try {
        const ID = +req.params.productId; // Convierte el valor a número usando +
        const list = await productList.getProducts();
        const result = list.find(ele => ele.id === ID);
        if(result){

            res.send(result)
        } else{
            res.send(`<h1 style="color:red;text-align:center">Producto No encontrado</h1>`)
        }
     
    } catch (error) {
        res.send(error);
    }
    
})

server.listen(8080, ()=>{
    console.log('servidor en el puerto 8080')
});

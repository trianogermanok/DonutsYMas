//Importacion de Modulos:

//Para crear y configuar el servidor
import express from 'express';
//Para interactual con el sistema de archivos
import fs from 'fs';
//Para manegar nuestra clase ProductManager
import ProductManager from './managers/productManager.js';
import CartManager from './managers/cartManager.js';
import path from 'path';
//Instanciamos varibles para trabajar con el servidor, app y puerto:
const app = express();
const PORT = 8080;

//Creamos un Middleware para parsear JSON en las solicitudes
app.use(express.json());

//Instancia de ProductManager
const productManager = new ProductManager(path.resolve('data/products.json'));
//Instancia de CartManager
const cartManager = new CartManager(path.resolve('data/cart.json'));

//LOGICA DE FUNCIONAMIENTO DEL SERVIDOR PARA LOS CARRITOS --->

//Ruta para listar los productos de un carrito por ID
app.get('/api/carts/:cid', async (req, res) => {
    const {cid} = req.params;
    try {
        const products = await cartManager.getProducts(parseInt(cid));
        res.status(200).json(products);
    } catch (error) {
        res.status(400).send(error.message)
    }
});

//Ruta para agregar un producto a un carrito
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const {cid} = req.params;
    const {pid} = req.params;
    try {
        const addProductToCart = await cartManager.addProductToCart(parseInt(pid), parseInt(cid));
        res.status(200).json(addProductToCart);
    } catch (error) {
        res.status(500).send("Error al cargar el producto al carrito");
    }
})

//Ruta para crear un nuevo carrito
app.post('/api/carts', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(200).json(newCart)
    } catch (error) {
        res.status(500).send("Error al crear el carrito");
    }
})

//LOGICA DE FUNCIONAMIENTO DEL SERVIDOR PARA LOS PRODUCTOS --->

//Ruta GET para obtener todos los productos
app.get('/api/products', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

//Ruta GET para obtener un producto por ID
app.get('/api/products/:id', async (req, res) => {
    const {id} = req.params;
    const ifExist = await productManager.getProductById(parseInt(id));
    if (ifExist) {
        res.json(ifExist);
    } else {
        res.status(404).send('El producto no existe')
    }
});

//Ruta GET para la raiz
app.get('/', (req, res) =>{
    res.send("prueba");
})

//Ruta POST para agregar un nuevo producto
app.post('/api/products', async (req, res) => {
    const newProduct = req.body;
    try {
        const addedProduct = await productManager.addProduct(newProduct);
        res.status(201).json(addedProduct);
    } catch (err) {
        res.status(500).send("Error al agregar el producto.");
    }
});

//Ruta PUT para modificar un producto pasado por id
app.put('/api/products/:id', async (req, res) => {
    const {id} = req.params;
    const ifExist = await productManager.getProductById(parseInt(id));
    if (ifExist) {
        const actProduct = req.body;
        //Mantenemos el ID del producto original
        actProduct.id = ifExist.id;
        //Llamamos al metodo actProduct para que actualice el producto seleccionado
        await productManager.actProduct(actProduct);
        res.status(200).send('El producto fue actualizado correctamente')
    } else {
        res.status(404).send('El producto no existe')
    }
})

//Ruta DELETE para elminar un pasado por id
app.delete('/api/products/:id', async (req, res) => {
    const {id} = req.params;
    const ifExist = await productManager.getProductById(parseInt(id));
    if (ifExist) {
        await productManager.deleteProduct(ifExist);
        res.status(200).send('El producto fue eliminado correctamente')
    } else {
        res.status(404).send('El producto no existe')
    }
})

//Iniciamos el servidor
app.listen(PORT, () =>{
    console.log(`Servidor saliendo por el puerto ${PORT}`);
}); 

export default productManager;
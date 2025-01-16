//LOGICA DE FUNCIONAMIENTO DEL SERVIDOR PARA LOS PRODUCTOS --->
import { Router } from "express";
import path from 'path';
import ProductManager from '../managers/productManager.js';
const router = Router();

const productManager = new ProductManager(path.resolve('./data/products.json'));

//Ruta GET para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send("Error al obtener todos los productos")
    }
});

//Ruta GET para obtener un producto por ID
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const ifExist = await productManager.getProductById(parseInt(id));
        if (!ifExist) {
            throw new Error("El producto no existe");
        }
        res.status(200).json(ifExist);
    } catch (error) {
        res.status(404).send("El producto no existe")
    }
});

//Ruta POST para agregar un nuevo producto
router.post('/', async (req, res) => {
    /*const newProduct = req.body;
    try {
        const addedProduct = await productManager.addProduct(newProduct);
        res.status(201).json(addedProduct);
    } catch (err) {
        res.status(500).send("Error al agregar el producto.");
}}*/
    const newProduct = req.body;
    try {
        const addedProduct = await productManager.addProduct(newProduct);
        const products = await productManager.getProducts();
        req.app.get('io').emit('updateProducts', products); // Emitir evento a través de WebSocket
        res.status(201).json(addedProduct);
    } catch (error) {
        res.status(500).send("Error al agregar el producto.");
    }
});

//Ruta PUT para modificar un producto pasado por id
router.put('/', async (req, res) => {
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
router.delete('/', async (req, res) => {
    const {id} = req.params;
    const ifExist = await productManager.getProductById(parseInt(id));
    if (ifExist) {
        await productManager.deleteProduct(ifExist);
        res.status(200).send('El producto fue eliminado correctamente')
    } else {
        res.status(404).send('El producto no existe')
    }
})

export default router;
//LOGICA DE FUNCIONAMIENTO DEL SERVIDOR PARA LOS CARRITOS --->
import { Router } from "express";
import path from 'path';
import CartManager from '../managers/cartManager.js';
const router = Router();

const cartManager = new CartManager(path.resolve('./data/cart.json'));

//Ruta para listar todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCart();
        res.status(200).json(carts);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

//Ruta para listar los productos de un carrito por ID
router.get('/:cid', async (req, res) => {
    const {cid} = req.params;
    try {
        const products = await cartManager.getProducts(parseInt(cid));
        res.status(200).json(products);
    } catch (error) {
        res.status(400).send(error.message)
    }
});

//Ruta para agregar un producto a un carrito
router.post('/:pid', async (req, res) => {
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
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(200).json(newCart)
    } catch (error) {
        res.status(500).send("Error al crear el carrito");
    }
});

export default router;
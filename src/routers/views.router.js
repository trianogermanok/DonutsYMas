import { Router } from 'express';
import ProductManager from '../managers/productManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { title: 'Productos', products });
});

export default router;

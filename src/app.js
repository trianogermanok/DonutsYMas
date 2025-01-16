import express from 'express';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import { engine } from 'express-handlebars';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';
import ProductManager from './managers/productManager.js';

const app = express();

// Configuración de Socket.io
const server = http.createServer(app);
const io = new Server(server);

// Crear una instancia de ProductManager
const productManager = new ProductManager(path.resolve('./data/products.json'));

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve('./src/views')); // Ruta de las vistas

// Montamos los routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta GET para la raíz
app.get('/', (req, res) => {
    res.send("prueba");
});

// Ruta para mostrar productos en tiempo real
app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

// Configuración de WebSockets
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Escuchar evento para agregar producto
    socket.on('addProduct', async (data) => {
        await productManager.addProduct(data);  // Agregar el nuevo producto
        const products = await productManager.getProducts();  // Obtener productos actualizados
        io.emit('updateProducts', products);  // Emitir los productos a todos los clientes
    });

    // Desconectar cliente
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor HTTP y WebSockets
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

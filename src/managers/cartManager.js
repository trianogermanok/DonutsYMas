import fs from 'fs';
import productManager from '../routers/products.router.js';

class CartManager {
    static idAuto = 0;
    constructor(path){
        this.path = path;
    }

    //Metodo para agregar un producto a un carrito
    async addProductToCart(productId, cartId){
        //Guardamos tanto los productos como los carritos en constantes para usarlos
        const products = await productManager.getProducts();
        const carts = await this.getCart();

        //Validamos que el producto exista
        const product = products.find(element => element.id === productId);
        if (!product) {
            return console.log('El producto no existe');
        }
        const pid = product.id; //Guardamos su ID en una variable

        //Validamos que el carrito exista
        const cart = carts.find(element => element.cartId === cartId);
        if (!cart) {
            return console.log('El carrito no existe');
        }

        //Si el producto ya existe en el carrito incrementamos en 1 su propiedad quantity
        const ifExist = cart.products.find(element => element.pid === pid);
        if (ifExist) {
            ++ifExist.quantity;
            return new Promise((resolve, reject) => {
                fs.writeFile(this.path, JSON.stringify(carts, null, 2), (err) => {
                    if(err){
                        console.error(`Error al escribir el archivo ${err}`)
                        return reject(err);
                    }
                    resolve(cart);
                });
            });
        }

        //Si el producto no existe creamos un objeto con la propiedad pid y quantity
        let quantity = 1;
        const productToAdd = { pid , quantity };
        cart.products.push(productToAdd)

        //Escribimos el archivo cart.json con la nueva informacion
        return new Promise((resolve, reject) => {
            fs.writeFile(this.path, JSON.stringify(carts, null, 2), (err) => {
                if(err){
                    console.error(`Error al escribir el archivo ${err}`)
                    return reject(err);
                }
                resolve(cart);
            });
        });
    }

    //Metodo para listar los productos de un carrito por ID
    async getProducts(id){
        const carts = await this.getCart();
        const cart = carts.find(element => element.cartId === id);
        if (!cart) {
            return console.log('El producto no existe');
        }
        return cart.products;
    }

    //Metodo para traer el archivo .JSON con todos los carritos
    async getCart(){
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, 'utf-8', (err, data) => {
                if(err){
                    //Si hay un error devuelve el error y un array vacio.
                    console.log(err);
                    return resolve([]);
                }
                try {
                    const cart = JSON.parse(data);
                    return resolve(cart)
                } catch (parseError) {
                    console.error(`Error al parsear JSON: ${parseError}`)
                    resolve([]);
                }
            });
        });
    }

    //Metodo para crear el carrito
    async createCart(){
        //Creamos array de productos
        const products = [];
        //Guardamos los carritos en la constante cart
        const cart = await this.getCart();
        //Autoincrementamos el ID del carrito
        const cartId = ++CartManager.idAuto;
        //Creamos un objeto newCart con los productos que le pasamos por parameto y el ID autoincremental
        const newCart = { products , cartId};
        //Pusheamos ese nuevo carrito a nuestro .JSON de carritos
        cart.push(newCart);
        //Guardamos y actualizamos el archivo .JSON
        return new Promise((resolve, reject) => {
            fs.writeFile(this.path, JSON.stringify(cart, null, 2), (err) => {
                if(err){
                    console.error(`Error al escribir el archivo ${err}`)
                    return reject(err);
                }
                resolve(cart);
            });
        });
    }
}

export default CartManager;
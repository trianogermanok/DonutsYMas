import fs from 'fs';

class ProductManager {
    static idAuto = 15; //Lo inicializo en 15 porque ya tengo productos precargados
    constructor(path){
        this.path = path;
    }

    //Funcion para eliminar un producto
    async deleteProduct(product){
        //Traemos los productos para buscar el producto en el array
        const products = await this.getProducts();
        //Bucamos que indice ocupa el producto a eliminar en el array
        const indexProduct = products.findIndex(p => p.id === product.id)
        if (indexProduct === -1) {
            return console.log('El producto no esta listado');
        }
        //Usamos el metodo splice para eliminar el producto
        products.splice(indexProduct, 1);
        //Actualizamos nuestro .JSON
        return new Promise((resolve, reject) => {
            fs.writeFile(this.path, JSON.stringify(products, null, 2), (err) => {
                if(err){
                    console.error(`Error al escribir el archivo ${err}`)
                    return reject(err);
                }
                resolve(products);
            });
        });
    }

    //Funcion para actualziar un producto con el metodo PUT
    async actProduct(product){
        const products = await this.getProducts();
        //Validamos que todos los campos del nuevo producto esten completos
        if (!product.title ||
            !product.description ||
            !product.price ||
            !product.thumbnail ||
            !product.code ||
            !product.stock ||
            !product.category) {
            return console.log('Todos los campos son obligatorios.');
        }
        //Validamos que el code no se repita.
        const findCodeExist = products.find(element => element.code === product.code);
        if (findCodeExist) {
            return console.log(`Ya existe un producto con el codigo ${product.code}`);
        }
        //Le colocamos el estado segun la cantidad de stock
        if (product.stock >= 1) {
            product.status = true;
        } else {
            product.status = false;
        }
        //Actualizamos el producto
        findCodeExist === product;
        //Guardamos y actualizamos el archivo .JSON
        return new Promise((resolve, reject) => {
            fs.writeFile(this.path, JSON.stringify(products, null, 2), (err) => {
                if(err){
                    console.error(`Error al escribir el archivo ${err}`)
                    return reject(err);
                }
                resolve(findCodeExist);
            });
        });
    }

    async addProduct(newProduct){
        //Nos traemos todos los productos cargados en el .JSON
        const products = await this.getProducts();
        //Primero validamos que todos los campos del nuevo producto esten completos
        if (!newProduct.title || 
            !newProduct.description || 
            !newProduct.price || 
            !newProduct.thumbnail || 
            !newProduct.code || 
            !newProduct.stock ||
            !newProduct.category) {
            return console.log('Todos los campos son obligatorios.');
        }
        //Una vez hecha la primera validacion, debemos validar que el code no se repita.
        const findCodeExist = products.find(element => element.code === newProduct.code);
        if (findCodeExist) {
            return console.log(`Ya existe un producto con el codigo ${newProduct.code}`);
        }
        //Cuando se completen ambas validaciones procedemos a crear el nuevo producto.
        //Le colocamos el ID autoincrementable:
        newProduct.id = ++ProductManager.idAuto;
        //Le colocamos el estado segun la cantidad de stock
        if (newProduct.stock >= 1) {
            newProduct.status = true;
        } else {
            newProduct.status = false;
        }
        //Cargamos el producto en el .JSON
        products.push(newProduct);
        //Guardamos y actualizamos el archivo .JSON
        return new Promise((resolve, reject) => {
            fs.writeFile(this.path, JSON.stringify(products, null, 2), (err) => {
                if(err){
                    console.error(`Error al escribir el archivo ${err}`)
                    return reject(err);
                }
                resolve(newProduct);
            });
        });
    }

    async getProductById(id){
        const products = await this.getProducts();
        return products.find(element => element.id === id) || null
    }

    getProducts(){
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, 'utf-8', (err, data) => {
                if(err){
                    //Si hay un error devuelve el error y un array vacio.
                    console.log(err);
                    return resolve([]);
                }
                try {
                    const products = JSON.parse(data);
                    resolve(products)
                } catch (parseError) {
                    console.error(`Error al parsear JSON: ${parseError}`)
                    resolve([]);
                }
            });
        });
    }


}

export default ProductManager;





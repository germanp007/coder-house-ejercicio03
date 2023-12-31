import fs from "fs";

export class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }
  async addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Must fill all fields");
      return;
    }
    try {
      if (fs.existsSync(this.filePath)) {
        let productsJSON = await fs.promises.readFile(this.filePath, "utf-8");
        const productData = JSON.parse(productsJSON);
        if (productData.some((element) => element.code === code)) {
          console.log(`This code ${code} already exists, try another one`);
          return;
        }

        const newId = productData.length > 0 ? productData[productData.length - 1].id + 1 : 1;
        const newProduct = {
          id: newId,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        productData.push(newProduct);
        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify(productData, null, 2)
        );
        console.log("Product Added correctly");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  async updateProduct(id, fields){
    try {
      const productList = await this.getProducts();
      const productIndex = productList.findIndex(ele => ele.id === id)
      if(productIndex < 0){
        console.log(`Product with ID ${id} not found`)
      }
      const productUpdated = {
        id,
        ...productList[productIndex],
        ...fields,
      }
      productList[productIndex] = productUpdated;
      await fs.promises.writeFile(this.filePath, JSON.stringify(productList, null,2))
      console.log('Producto actualizado con exito')
    } catch (error) {
      console.log('Hubo un error al actualizar el producto')
    }
  }
  async getProducts() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = await fs.promises.readFile(this.filePath, "utf-8");
        const productList = JSON.parse(data);
        console.log(productList);
        return productList;
      }
    } catch (error) {
      console.log('Hubo un error al obtener el listado de Productos');
    }
  }
  async deleteProduct(id){
    
    try {
      const dataJSON = await this.getProducts()
      const productList = dataJSON.filter(ele => ele.id !== id)
      
      await fs.promises.writeFile(this.filePath, JSON.stringify(productList, null, 2))
      console.log('Product deleted')
    } catch (error) {
      console.log('El producto no pudo ser borrado')
    }
    

  }
  async getProductById(id) {
    try {
      if (fs.existsSync(this.filePath)) {
        const productList = await this.getProducts();
        let product = productList.find((element) => element.id == id);
        if (product) {
          return product;
        } else {
          throw new Error("El producto no fue encontrado");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}






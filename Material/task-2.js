const products = [
    { id: 1, name: "Keyboard", price: 50, stock: 10 },
    { id: 2, name: "Mouse", price: 25, stock: 4 },
    { id: 3, name: "Monitor", price: 200, stock: 7 }
];

// add a new product
function addProduct(products, newProduct) {
    return [...products, newProduct];
}

// update product stock
function updateStock(products, productId, newStock) {
    return products.map(function (product) {
        if (product.id === productId) {
            return { ...product, stock: newStock };
        }

        return product;
    });
}

// update product price
function updatePrice(products, productId, newPrice) {
    return products.map(function (product) {
        if (product.id === productId) {
            return { ...product, price: newPrice };
        }

        return product;
    });
}

// remove product by id
function removeProduct(products, productId) {
    return products.filter(function (product) {
        return product.id !== productId;
    });
}

// search products by name
function searchProducts(products, searchName) {
    return products.filter(function (product) {
        return product.name.toLowerCase().includes(searchName.toLowerCase());
    });
}

// find products below a given stock quantity
function lowStockProducts(products, quantity) {
    return products.filter(function (product) {
        return product.stock < quantity;
    });
}

// calculate total inventory value
function calculateInventoryValue(products) {
    let total = 0;

    for (let i = 0; i < products.length; i++) {
        total = total + (products[i].price * products[i].stock);
    }

    return total;
}


// test add product
const productsAfterAdd = addProduct(products, {
    id: 4,
    name: "Headphones",
    price: 75,
    stock: 6
});

console.log("1. After adding product:");
console.log(productsAfterAdd);


// test update stock
const productsAfterStockUpdate = updateStock(products, 2, 8);

console.log("\n2. After updating Mouse stock:");
console.log(productsAfterStockUpdate);


// test update price
const productsAfterPriceUpdate = updatePrice(products, 3, 180);

console.log("\n3. After updating Monitor price:");
console.log(productsAfterPriceUpdate);


// test remove product
const productsAfterRemove = removeProduct(products, 2);

console.log("\n4. After removing Mouse:");
console.log(productsAfterRemove);


// test search
const searchedProducts = searchProducts(products, "mouse");

console.log("\n5. Search result:");
console.log(searchedProducts);


// test low stock
const lowStock = lowStockProducts(products, 6);

console.log("\n6. Products below stock quantity 6:");
console.log(lowStock);


// test inventory value
const inventoryValue = calculateInventoryValue(products);

console.log("\n7. Total inventory value:");
console.log(inventoryValue);


// check original array
console.log("\n8. Original products array:");
console.log(products);
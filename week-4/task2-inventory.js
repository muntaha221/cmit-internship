let products = [
  { id: 1, name: "Keyboard", price: 50, stock: 10 },
  { id: 2, name: "Mouse", price: 25, stock: 4 },
  { id: 3, name: "Monitor", price: 200, stock: 7 }
];

// 1. Add a new product
function addProduct(productsArray, newProduct) {
  let updatedList = [...productsArray, newProduct];
  return updatedList;
}

// 2. Update product stock by id
function updateStock(productsArray, id, newStock) {
  let updatedList = productsArray.map(function (product) {
    if (product.id === id) {
      return { ...product, stock: newStock };
    }
    return product;
  });
  return updatedList;
}

// 3. Update product price by id
function updatePrice(productsArray, id, newPrice) {
  let updatedList = productsArray.map(function (product) {
    if (product.id === id) {
      return { ...product, price: newPrice };
    }
    return product;
  });
  return updatedList;
}

// 4. Remove a product by id
function removeProduct(productsArray, id) {
  let updatedList = productsArray.filter(function (product) {
    return product.id !== id;
  });
  return updatedList;
}

// 5. Search products by name (case-insensitive, partial match)
function searchProductsByName(productsArray, searchTerm) {
  let results = productsArray.filter(function (product) {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return results;
}

// 6. Return products below a given stock quantity
function getLowStockProducts(productsArray, minStock) {
  let lowStock = productsArray.filter(function (product) {
    return product.stock < minStock;
  });
  return lowStock;
}

// 7. Calculate total inventory value (price * stock, summed)
function getTotalInventoryValue(productsArray) {
  let total = 0;
  for (let i = 0; i < productsArray.length; i++) {
    total = total + productsArray[i].price * productsArray[i].stock;
  }
  return total;
}

// ---- Testing everything below ----
console.log("Add new product (Headphones):");
console.log(addProduct(products, { id: 4, name: "Headphones", price: 40, stock: 15 }));

console.log("\nUpdate stock of Mouse (id 2) to 20:");
console.log(updateStock(products, 2, 20));

console.log("\nUpdate price of Monitor (id 3) to 180:");
console.log(updatePrice(products, 3, 180));

console.log("\nRemove product with id 1 (Keyboard):");
console.log(removeProduct(products, 1));

console.log("\nSearch products with name 'mo':");
console.log(searchProductsByName(products, "mo"));

console.log("\nProducts with stock below 8:");
console.log(getLowStockProducts(products, 8));

console.log("\nTotal inventory value:");
console.log(getTotalInventoryValue(products));

// checking original array is not modified
console.log("\nOriginal products array (should be unchanged):");
console.log(products);

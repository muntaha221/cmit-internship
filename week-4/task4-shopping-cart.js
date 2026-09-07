// Products available in the store (used to check stock and price)
let products = [
  { id: 1, name: "Keyboard", price: 50, stock: 10 },
  { id: 2, name: "Mouse", price: 25, stock: 4 },
  { id: 3, name: "Monitor", price: 200, stock: 7 }
];

// Cart starts empty
let cart = [];

// Helper - find a product from the products list by id
function findProductById(id) {
  return products.find(function (product) {
    return product.id === id;
  });
}

// 1. Add product to cart
function addToCart(productId, quantity) {
  let product = findProductById(productId);

  if (!product) {
    console.log("Product not found");
    return;
  }

  // check if item already exists in cart
  let existingItem = cart.find(function (item) {
    return item.productId === productId;
  });

  if (existingItem) {
    // increase quantity instead of duplicate entry
    let newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      console.log("Cannot add more than available stock");
      return;
    }

    existingItem.quantity = newQuantity;
  } else {
    // don't allow quantity more than stock on first add either
    if (quantity > product.stock) {
      console.log("Cannot add more than available stock");
      return;
    }

    cart.push({
      productId: productId,
      name: product.name,
      price: product.price,
      quantity: quantity
    });
  }
}

// 2. Remove product completely from cart
function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.productId !== productId;
  });
}

// 3. Update quantity of an existing cart item
function updateQuantity(productId, quantity) {
  let product = findProductById(productId);
  let item = cart.find(function (cartItem) {
    return cartItem.productId === productId;
  });

  if (!item) {
    console.log("Item not in cart");
    return;
  }

  if (quantity > product.stock) {
    console.log("Cannot set quantity more than available stock");
    return;
  }

  item.quantity = quantity;
}

// 4. Calculate total price of all cart items
function getCartTotal() {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total = total + cart[i].price * cart[i].quantity;
  }
  return total;
}

// 5. Apply a percentage discount to the total
function applyDiscount(percent) {
  let total = getCartTotal();
  let discountAmount = (total * percent) / 100;
  let finalTotal = total - discountAmount;
  return finalTotal;
}

// 6. Return a complete cart summary
function getCartSummary() {
  return {
    items: cart,
    totalItems: cart.length,
    totalPrice: getCartTotal()
  };
}

// ---- Testing everything below ----
addToCart(1, 2); // add 2 keyboards
addToCart(2, 1); // add 1 mouse
addToCart(1, 1); // add 1 more keyboard, should become quantity 3

console.log("Cart after adding items:");
console.log(cart);

updateQuantity(2, 3); // change mouse quantity to 3
console.log("\nCart after updating mouse quantity:");
console.log(cart);

removeFromCart(1); // remove keyboard completely
console.log("\nCart after removing keyboard:");
console.log(cart);

console.log("\nCart total:");
console.log(getCartTotal());

console.log("\nTotal after 10% discount:");
console.log(applyDiscount(10));

console.log("\nCart summary:");
console.log(getCartSummary());

# Week 4 — JavaScript Exercise Tasks

## Overview

Week 4 focuses on practicing JavaScript arrays, objects, functions, asynchronous programming, and basic application logic.

There are four separate tasks:

1. Student Result Processor
2. Inventory Management
3. Async User Data Loader
4. Shopping Cart Management System

The main idea throughout the week is:

```text
Read the requirement
      ↓
Break it into small functions
      ↓
Implement one function at a time
      ↓
Test the function
      ↓
Move to the next requirement
```

The original data should not be modified directly where the task requires it. Instead, create new arrays or objects using techniques such as:

```js
map()
filter()
[...array]
```

This makes the code easier to understand and reduces unintended side effects.

---

# Task 1 — Student Result Processor

## Objective

Process structured student data using JavaScript arrays and objects.

Given data:

```js
const students = [
    { id: 1, name: "Ali", marks: [70, 80, 65] },
    { id: 2, name: "Sara", marks: [90, 85, 88] },
    { id: 3, name: "John", marks: [45, 55, 50] }
];
```

Requirements:

* Calculate average marks for every student.
* Add a grade property.
* Return students who passed.
* Sort students by average marks.
* Find the highest-scoring student.
* Calculate the overall class average.
* Do not modify the original array.

---

## 1. Calculate average marks

The first job is to calculate the average of each student's marks.

### Basic formula

```text
average = total marks / number of marks
```

Example:

```text
Ali:
70 + 80 + 65 = 215

215 / 3 = 71.67
```

A helper function can calculate the average for one student's marks:

```js
function calculateAverage(marks) {
    let total = 0;

    for (let i = 0; i < marks.length; i++) {
        total += marks[i];
    }

    return total / marks.length;
}
```

The function only does one job:

```text
marks
 ↓
add all marks
 ↓
divide by number of marks
 ↓
average
```

To calculate averages for every student, create new student objects rather than changing the original objects:

```js
function getStudentAverages(students) {
    return students.map(function (student) {
        return {
            ...student,
            average: calculateAverage(student.marks)
        };
    });
}
```

Example result:

```js
[
    {
        id: 1,
        name: "Ali",
        marks: [70, 80, 65],
        average: 71.66666666666667
    },
    {
        id: 2,
        name: "Sara",
        marks: [90, 85, 88],
        average: 87.66666666666667
    },
    {
        id: 3,
        name: "John",
        marks: [45, 55, 50],
        average: 50
    }
]
```

---

# 2. Add a grade property

The grade is calculated from the student's average.

One possible grading rule used in the implementation was:

```text
80+       → A
60–79     → B
50–59     → C
Below 50  → F
```

The task sheet itself does not specify the exact grade boundaries, so these boundaries should be treated as the implementation rule chosen for the exercise.

A grade helper can be:

```js
function getGrade(average) {
    if (average >= 80) {
        return "A";
    } else if (average >= 60) {
        return "B";
    } else if (average >= 50) {
        return "C";
    } else {
        return "F";
    }
}
```

Then add the grade without modifying the original data:

```js
function addGradeToStudents(students) {
    return students.map(function (student) {
        return {
            ...student,
            grade: getGrade(student.average)
        };
    });
}
```

---

# 3. Return students who passed

The implementation uses:

```text
average >= 50 → passed
average < 50  → failed
```

The task sheet only says to return students who passed; it does not explicitly define the passing threshold, so this threshold is an implementation choice.

Function:

```js
function getPassedStudents(students) {
    return students.filter(function (student) {
        return student.average >= 50;
    });
}
```

`filter()` creates a new array.

It does not remove students from the original array.

Example:

```js
[
    Ali,
    Sara
]
```

would be returned as passed students if their averages are at least 50.

---

# 4. Sort students by average

We need:

```text
highest average → lowest average
```

The sorting function:

```js
function sortStudentsByAverage(students) {
    const studentsWithGrade = addGradeToStudents(students);

    const sorted = [...studentsWithGrade];

    sorted.sort(function (a, b) {
        return b.average - a.average;
    });

    return sorted;
}
```

## What are `a` and `b`?

They are simply temporary names for the two student objects JavaScript is comparing.

For example:

```js
a = {
    name: "Ali",
    average: 71.66
};

b = {
    name: "Sara",
    average: 87.66
};
```

Then:

```js
b.average - a.average
```

becomes:

```text
87.66 - 71.66
```

This tells `sort()` how to order them.

### Descending order

```js
b.average - a.average
```

means:

```text
highest → lowest
```

### Ascending order

```js
a.average - b.average
```

means:

```text
lowest → highest
```

The spread operator:

```js
[...studentsWithGrade]
```

creates a new array before sorting.

This matters because `.sort()` changes the array it is called on.

---

# 5. Find the highest-scoring student

One simple implementation is:

```js
function getTopStudent(students) {
    let topStudent = students[0];

    for (let i = 1; i < students.length; i++) {
        if (students[i].average > topStudent.average) {
            topStudent = students[i];
        }
    }

    return topStudent;
}
```

The logic is:

```text
Start with first student
        ↓
Compare with next student
        ↓
If next average is higher
        ↓
Make that student the top student
        ↓
Continue
```

Example result:

```js
{
    id: 2,
    name: "Sara",
    average: 87.66666666666667,
    grade: "A"
}
```

---

# 6. Calculate overall class average

The class average is the average of all student averages.

```js
function getClassAverage(students) {
    let total = 0;

    for (let i = 0; i < students.length; i++) {
        total += students[i].average;
    }

    return total / students.length;
}
```

For example:

```text
Ali   = 71.67
Sara  = 87.67
John  = 50

(71.67 + 87.67 + 50) / 3
= 69.78 approximately
```

---

# 7. Keeping the original array unchanged

This is an important requirement.

The original data is:

```js
const students = [
    { id: 1, name: "Ali", marks: [70, 80, 65] },
    { id: 2, name: "Sara", marks: [90, 85, 88] },
    { id: 3, name: "John", marks: [45, 55, 50] }
];
```

The original objects should remain without:

```js
average
grade
```

being added directly to them.

Instead, create new objects:

```js
{
    ...student,
    average: ...
}
```

and new arrays:

```js
[...students]
```

This prevents unwanted side effects.

A simple check is:

```js
console.log(students);
```

after running all operations.

The original array should still look exactly like the starting data.

---

# Task 2 — Inventory Management

## Objective

Build a small utility that safely manages product data.

Given:

```js
const products = [
    { id: 1, name: "Keyboard", price: 50, stock: 10 },
    { id: 2, name: "Mouse", price: 25, stock: 4 },
    { id: 3, name: "Monitor", price: 200, stock: 7 }
];
```

Requirements:

* Add a new product.
* Update product stock.
* Update product price.
* Remove a product by ID.
* Search products by name.
* Return products below a given stock quantity.
* Calculate total inventory value.

---

# 1. Add a product

Use spread to create a new array:

```js
function addProduct(products, newProduct) {
    return [...products, newProduct];
}
```

Example:

```js
const updatedProducts = addProduct(products, {
    id: 4,
    name: "Headphones",
    price: 75,
    stock: 6
});
```

The original `products` array is unchanged.

---

# 2. Update stock

Use `map()`:

```js
function updateStock(products, productId, newStock) {
    return products.map(function (product) {
        if (product.id === productId) {
            return {
                ...product,
                stock: newStock
            };
        }

        return product;
    });
}
```

Only the matching product gets a new stock value.

---

# 3. Update price

The same idea:

```js
function updatePrice(products, productId, newPrice) {
    return products.map(function (product) {
        if (product.id === productId) {
            return {
                ...product,
                price: newPrice
            };
        }

        return product;
    });
}
```

---

# 4. Remove a product by ID

Use:

```js
filter()
```

```js
function removeProduct(products, productId) {
    return products.filter(function (product) {
        return product.id !== productId;
    });
}
```

This returns every product except the one whose ID matches.

---

# 5. Search products by name

A flexible search can use:

```js
includes()
```

and lowercase conversion:

```js
function searchProductsByName(products, searchText) {
    return products.filter(function (product) {
        return product.name
            .toLowerCase()
            .includes(searchText.toLowerCase());
    });
}
```

For example:

```js
searchProductsByName(products, "mo");
```

can match:

```text
Mouse
Monitor
```

because both contain `"mo"`.

This also makes the search case-insensitive.

---

# 6. Find low-stock products

```js
function getLowStockProducts(products, quantity) {
    return products.filter(function (product) {
        return product.stock < quantity;
    });
}
```

Example:

```js
getLowStockProducts(products, 8);
```

returns products whose stock is below 8.

---

# 7. Calculate total inventory value

For each product:

```text
price × stock
```

Then add all results.

```js
function getTotalInventoryValue(products) {
    let total = 0;

    for (let i = 0; i < products.length; i++) {
        total += products[i].price * products[i].stock;
    }

    return total;
}
```

For the original data:

```text
Keyboard → 50 × 10 = 500
Mouse    → 25 × 4  = 100
Monitor  → 200 × 7 = 1400

Total = 2000
```

Again, the original array is preserved.

---

# Task 3 — Async User Data Loader

## Objective

Use asynchronous JavaScript to retrieve related data from a public API.

The task specifically allows a public API such as:

```text
JSONPlaceholder
```

Requirements:

* Create `async function getUserDetails(userId)`.
* Fetch the selected user.
* Fetch the posts belonging to that user.
* Combine user and posts into one object.
* Create `getMultipleUsers(ids)` using `Promise.all()`.
* Use `async/await` and `try/catch`.
* Handle invalid IDs and failed requests without crashing.
* Return a meaningful error result when a request fails.

---

# 1. Fetch one user

Conceptually:

```js
async function getUserDetails(userId) {
    try {
        // fetch user
    } catch (error) {
        // handle error
    }
}
```

The first request is:

```text
/users/:id
```

For example:

```text
/users/1
```

The returned data represents the user.

---

# 2. Fetch the user's posts

Once the user exists, fetch:

```text
/posts?userId=1
```

This gives the posts belonging to that user.

The sequence is:

```text
getUserDetails(1)
      ↓
fetch user 1
      ↓
fetch posts of user 1
      ↓
combine
```

---

# 3. Combine the results

The final structure can be:

```js
{
    user: userData,
    posts: postsData
}
```

This is useful because the caller gets related data together instead of making separate calls itself.

---

# 4. Handle errors

A request can fail because:

* the ID is invalid
* the network fails
* the server returns an error
* the response is unexpected

Use:

```js
try {
    // asynchronous work
} catch (error) {
    return {
        success: false,
        message: error.message
    };
}
```

The key principle is:

```text
error happens
   ↓
catch it
   ↓
return useful information
   ↓
program continues safely
```

---

# 5. Load multiple users with Promise.all()

Suppose we want:

```js
const ids = [1, 2, 3];
```

We can create:

```js
async function getMultipleUsers(ids) {
    const results = await Promise.all(
        ids.map(function (id) {
            return getUserDetails(id);
        })
    );

    return results;
}
```

The important part is:

```js
Promise.all()
```

It allows several asynchronous operations to be started together.

Conceptually:

```text
User 1 ────────┐
User 2 ────────┼──→ Promise.all()
User 3 ────────┘
                    ↓
               all results
```

This is more efficient than waiting for one user request to finish before starting the next.

---

# Task 4 — Shopping Cart Management System

## Objective

Build a shopping cart using JavaScript.

Required functionality:

* `addToCart(productId, quantity)`
* Merge quantity if the product already exists.
* Do not allow quantity to exceed stock.
* `removeFromCart(productId)`
* `updateQuantity(productId, quantity)`
* `getCartTotal()`
* `applyDiscount(percent)`
* `getCartSummary()`

---

# 1. Add product to cart

The basic logic is:

```text
Find product
   ↓
Check stock
   ↓
Check whether product already exists in cart
   ↓
If yes → increase quantity
If no  → add new item
```

If the item already exists:

```text
existing quantity + new quantity
```

must not exceed:

```text
available stock
```

---

# 2. Do not exceed stock

Suppose:

```text
Stock = 10
Cart quantity = 6
New request = 5
```

Then:

```text
6 + 5 = 11
```

which is greater than stock.

So the application must reject the operation.

This prevents the cart from requesting more products than are available.

---

# 3. Remove from cart

```js
function removeFromCart(productId) {
    // remove matching cart item
}
```

The product is removed completely.

---

# 4. Update quantity

If the cart has:

```text
Keyboard × 2
```

and the user changes it to:

```text
Keyboard × 5
```

the quantity should become 5.

Again:

```text
5 ≤ available stock
```

must be true.

---

# 5. Calculate cart total

For every cart item:

```text
price × quantity
```

Then add everything.

Example:

```text
Keyboard
50 × 2 = 100

Mouse
25 × 3 = 75

Total = 175
```

---

# 6. Apply discount

Suppose:

```text
Total = 1000
Discount = 10%
```

Discount amount:

```text
1000 × 10 / 100 = 100
```

Final total:

```text
1000 - 100 = 900
```

Conceptually:

```js
function applyDiscount(percent) {
    const total = getCartTotal();

    const discount = total * percent / 100;

    return total - discount;
}
```

---

# 7. Cart summary

A summary can contain:

```js
{
    cart: [...],
    itemCount: ...,
    total: ...,
    discountedTotal: ...
}
```

The idea is to provide the complete current state of the cart in one object.

---

# Week 4 — Main JavaScript Concepts

## Arrays

Used heavily throughout the tasks.

Important methods:

```js
map()
filter()
find()
findIndex()
sort()
push()
splice()
```

Know what each one does and whether it changes the original array.

---

## Objects

The tasks work mostly with objects such as:

```js
{
    id: 1,
    name: "Ali",
    marks: [70, 80, 65]
}
```

Objects store related information together.

Access properties with:

```js
student.name
student.marks
student.average
```

---

## Spread operator

Example:

```js
const copy = [...students];
```

This creates a new array containing the same items.

For objects:

```js
const updatedStudent = {
    ...student,
    grade: "A"
};
```

This creates a new object with the existing properties plus the new property.

---

## `map()`

Use `map()` when you want to transform every item.

Example:

```js
const names = students.map(function (student) {
    return student.name;
});
```

Every item goes through the function.

---

## `filter()`

Use `filter()` when you want only certain items.

Example:

```js
const passed = students.filter(function (student) {
    return student.average >= 50;
});
```

Only matching students remain in the returned array.

---

## `find()`

Use `find()` when you want one matching item:

```js
const user = users.find(function (user) {
    return user.id === 2;
});
```

It returns the matching object or `undefined`.

---

## `sort()`

Used to rearrange an array.

Descending numerical order:

```js
array.sort(function (a, b) {
    return b.value - a.value;
});
```

Remember that `.sort()` changes the array itself, so copy it first when the original must remain unchanged:

```js
const sorted = [...array];
```

---

## Promises

A Promise represents an asynchronous operation that may:

```text
succeed
```

or:

```text
fail
```

Handle success:

```js
.then(...)
```

Handle failure:

```js
.catch(...)
```

---

## `async/await`

Makes asynchronous code easier to read:

```js
async function loadData() {
    try {
        const data = await getData();
        return data;
    } catch (error) {
        return error;
    }
}
```

---

## `Promise.all()`

Used when multiple asynchronous operations can run together.

```js
const results = await Promise.all([
    getUserDetails(1),
    getUserDetails(2),
    getUserDetails(3)
]);
```

---

# Important Rules from Week 4

## Keep tasks separate

Each numbered task should be treated as its own file.

Example structure:

```text
Week-4/
│
├── task1-student-result.js
├── task2-inventory.js
├── task3-async-user-data.js
└── task4-shopping-cart.js
```

The exact filename can be chosen as long as the tasks remain separate.

---

## One function per requirement

Instead of one giant function:

```js
function doEverything() {
    // 100 lines
}
```

use small functions:

```js
calculateAverage()
addGradeToStudents()
getPassedStudents()
sortStudentsByAverage()
getTopStudent()
getClassAverage()
```

Each function has one clear responsibility.

---

## Test as you build

A useful workflow is:

```text
Read requirement
      ↓
Write one function
      ↓
console.log() the result
      ↓
Check it
      ↓
Move to next function
```

This is easier to debug than writing everything first and testing only at the end.

---

# How to explain Week 4 to someone else

A simple explanation is:

> Week 4 was about practicing JavaScript arrays, objects, functions, and asynchronous programming through four small applications. In the first two tasks I worked with arrays and objects and avoided modifying the original data directly. In the third task I worked with asynchronous API requests using async/await, error handling, and Promise.all. In the fourth task I built shopping-cart logic for adding, removing, updating quantities, calculating totals, applying discounts, and generating a summary.

Then explain each task briefly:

### Task 1

> I processed student data by calculating averages, assigning grades, finding passed students, sorting by average, finding the top student, and calculating the class average.

### Task 2

> I built inventory functions for adding, updating, removing, searching, finding low-stock products, and calculating inventory value.

### Task 3

> I used a public API to fetch users and their posts, combined related results, handled errors with try/catch, and loaded multiple users using Promise.all.

### Task 4

> I built cart logic that handles quantities, stock limits, item removal, quantity updates, totals, discounts, and a complete summary.

---

# Final Week 4 Mental Model

```text
Task 1
Student data
   ↓
arrays + objects + functions
   ↓
transform / filter / sort
   ↓
results
```

```text
Task 2
Product data
   ↓
map / filter / search
   ↓
inventory operations
   ↓
inventory result
```

```text
Task 3
API
   ↓
async/await
   ↓
fetch user
   ↓
fetch posts
   ↓
combine
   ↓
error handling
   ↓
Promise.all()
```

```text
Task 4
Products
   ↓
cart
   ↓
quantity + stock rules
   ↓
total
   ↓
discount
   ↓
summary
```

# Week 4 — What you should remember

* **Array methods** help you transform, filter, search, and sort data.
* **Objects** represent structured information.
* **Spread syntax** helps create new arrays/objects.
* **Do not mutate original data** when the task requires immutability.
* **Small functions** make the code easier to understand and test.
* **Promises** represent asynchronous operations.
* **async/await** makes asynchronous code easier to follow.
* **try/catch** handles asynchronous failures.
* **Promise.all()** allows multiple independent async operations to run together.
* **CRUD/cart-style logic** is mainly about turning requirements into small, testable functions.

This README follows the four Week 4 tasks and their stated requirements.

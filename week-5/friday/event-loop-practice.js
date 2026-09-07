console.log("1");

setTimeout(() => {
    console.log("2");
}, 0);

setTimeout(() => {
    console.log("3");
}, 0);

Promise.resolve().then(() => {
    console.log("4");
});

console.log("5");


// 1, 5       → normal synchronous code
// 4          → Promise microtask
// 2, 3       → timers
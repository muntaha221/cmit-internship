function first() {
    console.log("Inside first");
}

function second() {
    console.log("Inside second");
    first();
    console.log("Back inside second");
}

console.log("Start");

second();

console.log("End");

console.log("........................................experimenting");




console.log("Start");

setTimeout(function () {
    console.log("Timeout");
}, 0);

console.log("End");


console.log("1");

setTimeout(() => {
    console.log("2");
}, 0);

console.log("3");

setTimeout(() => {
    console.log("4");
}, 0);

console.log("5");
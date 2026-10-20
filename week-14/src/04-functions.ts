function add(a: number, b: number): number {
    return a + b;
}

function greet(name: string): string {
    return `Hello, ${name}!`;
}

function printMessage(message: string): void {
    console.log(message);
}

function greetWithTitle(name: string, title?: string): string {
    return title ? `${title} ${name}` : name;
}

function power(base: number, exp: number = 2): number {
    return base ** exp;
}

const multiply = (a: number, b: number): number => a * b;

async function fetchScore(userId: number): Promise<number> {
    return userId * 10;
}

console.log("add(5, 3):", add(5, 3));
console.log("greet('Muntaha'):", greet("Muntaha"));
printMessage("Learning TypeScript");
console.log("greetWithTitle('Ali'):", greetWithTitle("Ali"));
console.log("greetWithTitle('Ali', 'Dr.'):", greetWithTitle("Ali", "Dr."));
console.log("power(3):", power(3));
console.log("power(3, 4):", power(3, 4));
console.log("multiply(4, 5):", multiply(4, 5));

fetchScore(3).then(score => console.log("fetchScore(3):", score));

export {};

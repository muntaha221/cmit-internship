class User {
    name: string;
    email: string;
    readonly createdAt: Date;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
        this.createdAt = new Date();
    }

    getEmail(): string {
        return this.email;
    }
}

const user = new User("Muntaha", "muntaha@example.com");
console.log("Name:", user.name);
console.log("Email:", user.getEmail());
console.log("Created:", user.createdAt);

class Product {
    constructor(
        public title: string,
        private price: number
    ) {}

    getPrice(): number {
        return this.price;
    }
}

const product = new Product("Laptop", 1200);
console.log("Product:", product.title);
console.log("Price:", product.getPrice());

class Person {
    constructor(public name: string) {}

    introduce(): string {
        return `I am ${this.name}`;
    }
}

class Developer extends Person {
    constructor(name: string, public language: string) {
        super(name);
    }

    code(): string {
        return `${this.name} codes in ${this.language}`;
    }

    introduce(): string {
        return `I'm ${this.name}, a ${this.language} developer`;
    }
}

const dev = new Developer("Muntaha", "TypeScript");
console.log("dev.introduce():", dev.introduce());
console.log("dev.code():", dev.code());

class Animal {
    constructor(protected name: string) {}

    protected getInfo(): string {
        return `Animal: ${this.name}`;
    }
}

class Dog extends Animal {
    bark(): string {
        return `${this.getInfo()} says woof`;
    }
}

const dog = new Dog("Rex");
console.log("dog.bark():", dog.bark());

interface MessageSender {
    send(message: string): void;
}

class EmailSender implements MessageSender {
    send(message: string): void {
        console.log(`[Email] ${message}`);
    }
}

class SMSSender implements MessageSender {
    send(message: string): void {
        console.log(`[SMS] ${message}`);
    }
}

class FakeSender implements MessageSender {
    send(message: string): void {
        console.log(`[Test] Would have sent: ${message}`);
    }
}

class NotificationService {
    constructor(private sender: MessageSender) {}

    notify(message: string): void {
        this.sender.send(message);
    }
}

const emailService = new NotificationService(new EmailSender());
const smsService = new NotificationService(new SMSSender());
const testService = new NotificationService(new FakeSender());

emailService.notify("Welcome to the app!");
smsService.notify("Your verification code is 1234");
testService.notify("Testing in isolation");

export {};

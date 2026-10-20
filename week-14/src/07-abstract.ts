abstract class BaseService {
    abstract execute(): string;

    log(): void {
        console.log("Service running");
    }
}

class WelcomeService extends BaseService {
    execute(): string {
        return "Welcome service executed";
    }
}

const welcome = new WelcomeService();
welcome.log();
console.log(welcome.execute());

interface Notifier {
    send(message: string): void;
}

class EmailNotifier implements Notifier {
    send(message: string): void {
        console.log(`Email sent: ${message}`);
    }
}

class SMSNotifier implements Notifier {
    send(message: string): void {
        console.log(`SMS sent: ${message}`);
    }
}

const email = new EmailNotifier();
const sms = new SMSNotifier();
email.send("Welcome!");
sms.send("Your code is 1234");

interface Logger {
    log(msg: string): void;
}

interface Timestamped {
    timestamp: Date;
}

class AuditLog implements Logger, Timestamped {
    timestamp: Date;

    constructor() {
        this.timestamp = new Date();
    }

    log(msg: string): void {
        console.log(`[${this.timestamp.toISOString()}] ${msg}`);
    }
}

const audit = new AuditLog();
audit.log("User logged in");

export {};

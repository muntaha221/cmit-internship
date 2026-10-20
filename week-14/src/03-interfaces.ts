interface User {
    id: number;
    name: string;
    email: string;
    age?: number;
    readonly createdAt: Date;
}

type UserStatus = "active" | "inactive";

type UserSummary = {
    id: number;
    name: string;
};

const user: User = {
    id: 1,
    name: "Muntaha",
    email: "muntaha@example.com",
    createdAt: new Date()
};

const summary: UserSummary = {
    id: user.id,
    name: user.name
};

const status: UserStatus = "active";

console.log("User:", user);
console.log("Summary:", summary);
console.log("Status:", status);

function formatId(id: string | number): string {
    if (typeof id === "number") {
        return `ID-${id.toFixed(0)}`;
    }
    return id.toUpperCase();
}

console.log(formatId(101));
console.log(formatId("usr-101"));

export {};

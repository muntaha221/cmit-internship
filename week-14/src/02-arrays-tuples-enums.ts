let skills: string[] = ["Node.js", "Express", "MongoDB"];
let scores: number[] = [80, 90, 95];

let user: [string, number] = ["Muntaha", 23];

enum Role {
    Admin,
    User
}

let role: Role = Role.User;

let id: number | string = 101;
id = "USR-101";

let status: "pending" | "completed" = "pending";
status = "completed";

console.log("Skills:", skills);
console.log("Scores:", scores);
console.log("User:", user);
console.log("Role:", role);
console.log("ID:", id);
console.log("Status:", status);

export {};

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

type UpdateUser = Partial<User>;
const update: UpdateUser = { name: "Muntaha" };
console.log("Update:", update);

type UserPreview = Pick<User, "id" | "name">;
const preview: UserPreview = { id: 1, name: "Muntaha" };
console.log("Preview:", preview);

type PublicUser = Omit<User, "password">;
const publicUser: PublicUser = {
    id: 1,
    name: "Muntaha",
    email: "muntaha@example.com",
    isAdmin: false
};
console.log("Public:", publicUser);

type UserScores = Record<string, number>;
const scores: UserScores = {
    Muntaha: 95,
    Ali: 88,
    Sara: 92
};
console.log("Scores:", scores);

type SafeUpdate = Partial<Omit<User, "password" | "isAdmin">>;
const safeUpdate: SafeUpdate = { name: "New Name" };
console.log("Safe update:", safeUpdate);

export {};

import { User, CreateUserInput } from "../models/user";

const users: User[] = [];
let nextId = 1;

export function getUsers(): User[] {
    return users;
}

export function getUserById(id: number): User | undefined {
    return users.find((user) => user.id === id);
}

export function createUser(input: CreateUserInput): User {
    const user: User = {
        id: nextId++,
        name: input.name,
        email: input.email
    };

    users.push(user);
    return user;
}

export function updateUser(
    id: number,
    input: Partial<CreateUserInput>
): User | undefined {
    const user = getUserById(id);

    if (!user) return undefined;

    if (input.name !== undefined) user.name = input.name;
    if (input.email !== undefined) user.email = input.email;

    return user;
}

export function deleteUser(id: number): boolean {
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) return false;

    users.splice(index, 1);
    return true;
}

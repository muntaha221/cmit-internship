export interface User {
    id: number;
    name: string;
    email: string;
}

export type CreateUserInput = Pick<User, "name" | "email">;

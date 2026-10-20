function identity<T>(value: T): T {
    return value;
}

console.log(identity<string>("Hello"));
console.log(identity<number>(100));
console.log(identity(true));

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

const userResponse: ApiResponse<{ id: number; name: string }> = {
    success: true,
    data: { id: 1, name: "Muntaha" }
};

const usersResponse: ApiResponse<string[]> = {
    success: true,
    data: ["Ali", "Sara", "Usman"]
};

console.log(userResponse.data.name);
console.log(usersResponse.data.length);

function firstItem<T>(items: T[]): T | undefined {
    return items[0];
}

console.log(firstItem([10, 20, 30]));
console.log(firstItem(["a", "b"]));
console.log(firstItem([]));

function getLength<T extends { length: number }>(item: T): number {
    return item.length;
}

console.log(getLength("Hello"));
console.log(getLength([1, 2, 3]));

export {};

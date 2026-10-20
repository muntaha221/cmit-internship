import { Router, Request, Response } from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../services/userService";
import { CreateUserInput } from "../models/user";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
    res.json(getUsers());
});

router.get("/:id", (req: Request<{ id: string }>, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = getUserById(id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
});

router.post(
    "/",
    (req: Request<{}, unknown, CreateUserInput>, res: Response) => {
        const { name, email } = req.body;

        if (
            typeof name !== "string" || !name.trim() ||
            typeof email !== "string" || !email.trim()
        ) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const user = createUser({
            name: name.trim(),
            email: email.trim()
        });

        return res.status(201).json(user);
    }
);

router.patch(
    "/:id",
    (req: Request<{ id: string }, unknown, Partial<CreateUserInput>>, res: Response) => {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const { name, email } = req.body;

        if (
            (name !== undefined && (typeof name !== "string" || !name.trim())) ||
            (email !== undefined && (typeof email !== "string" || !email.trim()))
        ) {
            return res.status(400).json({ message: "Name and email must be non-empty strings" });
        }

        const user = updateUser(id, {
            ...(name !== undefined ? { name: name.trim() } : {}),
            ...(email !== undefined ? { email: email.trim() } : {})
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(user);
    }
);

router.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!deleteUser(id)) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(204).send();
});

export default router;

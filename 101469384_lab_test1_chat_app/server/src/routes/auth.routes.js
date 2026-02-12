import { Router } from "express";
import { usersStore } from "../store.js";

const router = Router();

router.post("/signup", (req, res) => {
    const { username, password, firstName, lastName } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ message: "username and password required" });
    }

    const exists = usersStore.find((u) => u.username === username);
    if (exists) return res.status(409).json({ message: "User already exists" });

    usersStore.push({ username, password, firstName: firstName || "", lastName: lastName || "" });

    return res.json({
        token: `demo:${username}`,
        user: { username, firstName: firstName || "", lastName: lastName || "" },
    });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body || {};

    const found = usersStore.find((u) => u.username === username && u.password === password);
    if (!found) return res.status(401).json({ message: "Invalid credentials" });

    return res.json({
        token: `demo:${username}`,
        user: { username: found.username, firstName: found.firstName, lastName: found.lastName },
    });
});

export default router;


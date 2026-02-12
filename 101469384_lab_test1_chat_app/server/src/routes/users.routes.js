import { Router } from "express";
import auth from "../middleware/auth.js";
import { usersStore } from "../store.js";

const router = Router();

//eeturn all registered users
router.get("/", auth, (req, res) => {
    const list = usersStore.map((u) => ({
        username: u.username,
        firstName: u.firstName,
        lastName: u.lastName,
    }));
    res.json(list);
});

export default router;

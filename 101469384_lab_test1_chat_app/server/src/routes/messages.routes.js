import express from "express";
import { auth } from "../middleware/auth.js";
import GroupMessage from "../models/GroupMessage.js";
import PrivateMessage from "../models/PrivateMessage.js";

const router = express.Router();

// group history
router.get("/group/:room", auth, async (req, res) => {
    const room = req.params.room;
    const msgs = await GroupMessage.find({ room }).sort({ _id: 1 }).limit(200);
    res.json(msgs);
});

// private history
router.get("/private/:otherUser", auth, async (req, res) => {
    const me = req.user.username;
    const other = req.params.otherUser;

    const msgs = await PrivateMessage.find({
        $or: [
            { from_user: me, to_user: other },
            { from_user: other, to_user: me }
        ]
    }).sort({ _id: 1 }).limit(200);

    res.json(msgs);
});

export default router;

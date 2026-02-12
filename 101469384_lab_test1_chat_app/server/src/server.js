import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import app from "./app.js";
import { registerSocket } from "./socket.js";

const PORT = process.env.PORT || 5001;

// --- Mongo is OPTIONAL (so server won't crash if Mongo isn't running)
async function tryMongo() {
    const uri = process.env.MONGO_URI; // if empty -> skip
    if (!uri) {
        console.log("MongoDB: skipped (no MONGO_URI set)");
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (err) {
        console.log("MongoDB connection failed (continuing without DB):", err.message);
    }
}

async function start() {
    await tryMongo();

    const server = http.createServer(app);

    const io = new Server(server, {
        cors: { origin: true, credentials: true },
    });

    registerSocket(io);

    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

start();




import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import restaurantsRouter from "./routes/restaurants.js";

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use("/restaurants", restaurantsRouter);

// Optional: quick home route
app.get("/", (req, res) => {
    res.send("API is running ✅");
});

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected ✅");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("MongoDB connection error ", err.message);
        process.exit(1);
    }
}

startServer();


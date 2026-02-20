// ===============================
// UPDATED WORKING SERVER.JS
// (adds JWT auth context + CORS + big body limit)
// ===============================

const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginLandingPageLocalDefault } = require("apollo-server-core");
const mongoose = require("mongoose");
require("dotenv").config();

// Import schema
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

// JWT helper (this is what your resolvers expect via ctx.user)
const { getUserFromReq } = require("./utils/auth");

// ===============================
// CONNECT TO MONGODB
// ===============================
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

// ===============================
// START SERVER
// ===============================
async function startServer() {
  await connectDB();

  const app = express();

  // Allow requests from browser tools (Apollo Studio / local / Postman)
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // IMPORTANT for base64 images / large payloads
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    context: ({ req }) => ({
      user: getUserFromReq(req), // <-- this makes ctx.user work
    }),
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: false, // we already applied cors() above
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log("🚀 Server running at:");
    console.log(`👉 http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();

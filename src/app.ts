import Fastify from "fastify";
import { connectToDatabase } from "./config/db";
import authRoutes from "./routes/auth";
import dotenv from "dotenv";
import passport from "./config/passport";
import cors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
dotenv.config();

const server = Fastify();

server.register(fastifyFormbody);

server.register(cors, {
  origin: "*", // Allow all origins. Change this to specific origins as needed.
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
});
//passport
server.register(passport);

// Register routes
server.register(authRoutes, { prefix: "/auth" });

const PORT = Number(process.env.PORT);
const HOST = process.env.HOST as string;
// Start the server
const start = async () => {
  try {
    await connectToDatabase();
    await server.listen({ port: PORT, host: HOST });
    console.log(`Server is running on http://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

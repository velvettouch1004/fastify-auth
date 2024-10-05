// src/controllers/authController.ts
import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { User } from "../models/User"; // Import the Mongoose User model

// Login User
export const loginUser = async (req: FastifyRequest, res: FastifyReply) => {
  const { email, password } = req.body as { email: string; password: string };
  console.log(email);

  // Find the user by email using Mongoose
  const user = await User.findOne({ email });

  if (!user) {
    return res.code(401).send({ email: "Email not found" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.code(401).send({ password: "Invalid password" });
  }

  // Exclude the password from the token payload
  const { password: _, ...userWithoutPassword } = user.toObject();

  const token = req.server.jwt.sign(userWithoutPassword);
  return res.send({ token });
};

// Register User
export const registerUser = async (req: FastifyRequest, res: FastifyReply) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  // Check if the user exists using Mongoose
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.code(409).send({ email: "Email already exists" });
  }

  // Hash the password and create a new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save(); // Save the user to MongoDB using Mongoose
    return res.code(201).send({ message: "User created successfully" });
  } catch (error) {
    req.log.error(error);
    return res.code(500).send({ error: "Internal Server Error" });
  }
};

// Get Profile
export const getProfile = async (req: FastifyRequest, res: FastifyReply) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.code(401).send({ error: "Token missing" });
  }

  try {
    const decoded = req.server.jwt.verify(token);
    return res.send(decoded);
  } catch (err) {
    req.log.error(err);
    return res.code(401).send({ error: "Invalid or expired token" });
  }
};

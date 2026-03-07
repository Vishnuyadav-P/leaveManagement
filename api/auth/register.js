import { connectDB } from "../../lib/db.js";
import { User } from "../../models/User.js";
import { generateToken } from "../../middleware/auth.js";

export default async function handler(req, res) {
  const allowedOrigin =
    process.env.CLIENT_URL || "https://leave-management-silk.vercel.app";

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email and password" });
    }

    const normalizedEmail = email.toLowerCase();

    if (role && !["employee", "employer"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be employee or employer" });
    }

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: role || "employee",
    });

    res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");

      return res.status(400).json({ message: messages });
    }

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    res.status(500).json({ message: "Server error during registration" });
  }
}
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    await prisma.todo.create({
      data: {
        userId: user.id,
        task: "This is a sample task for you bro!",
      },
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your_jwt_secret",
      {
        expiresIn: "8h",
      }
    );
    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your_jwt_secret",
      {
        expiresIn: "8h",
      }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

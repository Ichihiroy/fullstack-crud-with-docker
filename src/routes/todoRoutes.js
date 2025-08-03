import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const getTodos = prisma.todo.findMany({
    where: {
      userId: req.userId,
    },
  });
  const todos = await getTodos;
  res.status(200).json(todos);
});

router.post("/", async (req, res) => {
  const { task } = req.body;
  const newTodo = await prisma.todo.create({
    data: {
      task,
      userId: req.userId,
    },
  });

  res.json({
    id: newTodo.id,
    task: newTodo.task,
    completed: newTodo.completed,
  });
});

router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  const updatedTodo = await prisma.todo.update({
    where: {
      id: parseInt(id),
      userId: req.userId,
    },
    data: {
      completed: true,
    },
  });

  res.status(201).json("Todo updated successfully");
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.todo.delete({
    where: {
      id: parseInt(id),
      userId: req.userId,
    },
  });

  res.status(204).send("Todo deleted successfully");
});

export default router;

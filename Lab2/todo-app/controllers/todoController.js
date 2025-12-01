import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET /api/todos
export const getTodos = async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      include: { category: true },
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to load todos" });
  }
};

// GET /api/todos/:id
export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to load todo" });
  }
};

// POST /api/todos
export const createTodo = async (req, res) => {
  try {
    const { title, categoryId } = req.body;

    const todo = await prisma.todo.create({
      data: {
        title,
        categoryId: categoryId ? Number(categoryId) : null,
      },
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
};

// PUT /api/todos/:id
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed, categoryId } = req.body;

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        title,
        completed,
        categoryId: categoryId ? Number(categoryId) : null,
      },
    });

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
};

// PATCH /api/todos/:id/toggle
export const toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    const updated = await prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle todo" });
  }
};

// DELETE /api/todos/:id
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.todo.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};

import { Router } from "express";
import {  addTodo, deleteTodo, UpdateTodo, getTodo } from "../controllers/todo.controller.js";

const router = Router();

router.get("/", getTodo);
router.post("/", addTodo);
router.put("/:id", UpdateTodo);
router.delete("/:id", deleteTodo);

export default router;

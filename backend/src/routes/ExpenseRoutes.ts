import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  deleteExpense,
  getCategorySummary,
  getDashboardStats
} from "../controllers/expenseController";

const router = express.Router();

router.get("/analytics/dashboard-stats", getDashboardStats);
router.get("/analytics/category-summary", getCategorySummary);

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/:id", getExpenseById);
router.delete("/:id", deleteExpense);

export default router;
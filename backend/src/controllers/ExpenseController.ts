import { Request, Response } from "express";
import {
  PutCommand,
  ScanCommand,
  DeleteCommand,
  GetCommand
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { dynamoDB } from "../config/dynamo";

const TABLE_NAME = process.env.DYNAMODB_TABLE || "Expenses";

interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  createdAt: string;
}

export const createExpense = async (req: Request, res: Response) => {
  try {
    const expense: ExpenseItem = {
      id: uuidv4(),
      title: req.body.title,
      amount: Number(req.body.amount),
      category: req.body.category,
      date: req.body.date,
      description: req.body.description || "",
      createdAt: new Date().toISOString()
    };

    await dynamoDB.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: expense
      })
    );

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Failed to create expense", error });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const result = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE_NAME
      })
    );

    const expenses = (result.Items || []).sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses", error });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const result = await dynamoDB.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id: req.params.id }
      })
    );

    if (!result.Item) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(result.Item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expense", error });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    await dynamoDB.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id: req.params.id }
      })
    );

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete expense", error });
  }
};

export const getCategorySummary = async (req: Request, res: Response) => {
  try {
    const result = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE_NAME
      })
    );

    const summaryMap: Record<string, { _id: string; totalAmount: number; count: number }> = {};

    for (const item of result.Items || []) {
      const category = item.category || "Other";
      const amount = Number(item.amount || 0);

      if (!summaryMap[category]) {
        summaryMap[category] = {
          _id: category,
          totalAmount: 0,
          count: 0
        };
      }

      summaryMap[category].totalAmount += amount;
      summaryMap[category].count += 1;
    }

    res.status(200).json(
      Object.values(summaryMap).sort((a, b) => b.totalAmount - a.totalAmount)
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category summary", error });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const result = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE_NAME
      })
    );

    const expenses = result.Items || [];

    const totalExpenses = expenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const transactionCount = expenses.length;

    const categoryTotals: Record<string, number> = {};

    for (const item of expenses) {
      const category = item.category || "Other";
      categoryTotals[category] =
        (categoryTotals[category] || 0) + Number(item.amount || 0);
    }

    const topCategory =
      Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const monthlyBudget = 5000;
    const monthlyBudgetUsed =
      monthlyBudget > 0 ? Math.min(Math.round((totalExpenses / monthlyBudget) * 100), 100) : 0;

    res.status(200).json({
      totalExpenses,
      transactionCount,
      topCategory,
      monthlyBudgetUsed
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error });
  }
};
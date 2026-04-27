import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Expense Tracker API is running");
});

app.use("/api/expenses", expenseRoutes);

export default app;
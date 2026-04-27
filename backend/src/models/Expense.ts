import mongoose, { Document, Schema } from "mongoose";

export interface IExpense extends Document {
  title: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
}

const expenseSchema = new Schema<IExpense>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      enum: ["Food", "Travel", "Shopping", "Bills", "Health", "Other"]
    },
    date: {
      type: Date,
      required: true
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>("Expense", expenseSchema);
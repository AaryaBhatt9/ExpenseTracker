import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css'
})
export class ExpenseForm {
  expense: Expense = {
    title: '',
    amount: 0,
    category: 'Food',
    date: '',
    description: ''
  };

  categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Other'];

  constructor(private expenseService: ExpenseService) {}

  addExpense(): void {
    this.expenseService.createExpense(this.expense).subscribe({
      next: () => {
        //alert('Expense added successfully');
        window.location.reload();
      },
      error: (error) => {
        console.error('Failed to add expense:', error);
        //alert('Failed to add expense');
      }
    });
  }
}
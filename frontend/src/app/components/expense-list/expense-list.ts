import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css'
})
export class ExpenseList implements OnInit {
  expenses: Expense[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
      },
      error: (error) => {
        console.error('Failed to load expenses:', error);
      }
    });
  }

  deleteExpense(id: string | undefined): void {
    if (!id) return;

    this.expenseService.deleteExpense(id).subscribe({
      next: () => {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
      },
      error: (error) => {
        console.error('Failed to delete expense:', error);
        //alert('Failed to delete expense');
      }
    });
  }
}


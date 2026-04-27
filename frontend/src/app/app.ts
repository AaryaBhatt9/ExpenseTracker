import { Component, OnInit } from '@angular/core';
import { ExpenseForm } from './components/expense-form/expense-form';
import { ExpenseList } from './components/expense-list/expense-list';
import { Dashboard } from './components/dashboard/dashboard';
import { ExpenseService, DashboardStats } from './services/expense';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ExpenseForm,
    ExpenseList,
    Dashboard
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  stats: DashboardStats = {
    totalExpenses: 0,
    transactionCount: 0,
    topCategory: 'N/A',
    monthlyBudgetUsed: 0
  };

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.expenseService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Failed to load dashboard stats:', error);
      }
    });
  }
}
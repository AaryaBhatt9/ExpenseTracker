import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Expense {
  id?: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface DashboardStats {
  totalExpenses: number;
  transactionCount: number;
  topCategory: string;
  monthlyBudgetUsed: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:5000/api/expenses';

  constructor(private http: HttpClient) {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  createExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  deleteExpense(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCategorySummary(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/analytics/category-summary`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/analytics/dashboard-stats`);
  }
}
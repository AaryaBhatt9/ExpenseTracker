import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  barChartType: 'bar' = 'bar';

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Expenses by Category',
        borderWidth: 1
      }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadCategorySummary();
  }

  loadCategorySummary(): void {
    this.expenseService.getCategorySummary().subscribe({
      next: (summary) => {
        this.barChartData = {
          labels: summary.map(item => item._id),
          datasets: [
            {
              data: summary.map(item => item.totalAmount),
              label: 'Expenses by Category',
              borderWidth: 1
            }
          ]
        };
      },
      error: (error) => {
        console.error('Failed to load chart data:', error);
      }
    });
  }
}
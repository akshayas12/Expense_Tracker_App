import { Component } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Chart } from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent {
  expenses: any[] = [];
  searchQuery: string = '';
  totalExpenses = 0;
  expense = { category: '', amount: null };
  barChart: any;
  pieChart: any;
  viewAddExpense: boolean = false;

  currentPage = 1;
  itemsPerPage = 5;

  selectedMonth: string = '';
  selectedYear: string = '';
  months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' }
  ];
  availableYears: string[] = [];

  constructor(private expenseService: ExpenseService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(
      (data) => {
        this.expenses = Array.isArray(data) ? data : data.expenses || [];
        this.calculateTotal();
        this.extractYears();
        this.renderCharts();
      },
      (error) => console.error('Error fetching expenses:', error)
    );
  }

  extractYears() {
    const yearsSet = new Set<string>();
    this.expenses.forEach(exp => {
      const year = new Date(exp.date).getFullYear().toString();
      yearsSet.add(year);
    });
    this.availableYears = Array.from(yearsSet).sort();
  }

  calculateTotal() {
    this.totalExpenses = this.filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  renderCharts() {
    const expenseMap = new Map<string, number>();

    this.filteredExpenses.forEach(exp => {
      const categoryName = exp.category?.name || 'Unknown';
      expenseMap.set(categoryName, (expenseMap.get(categoryName) || 0) + exp.amount);
    });

    const categories = Array.from(expenseMap.keys());
    const amounts = Array.from(expenseMap.values());

    if (this.barChart) this.barChart.destroy();
    if (this.pieChart) this.pieChart.destroy();

    const softColors = [
      'rgba(255, 159, 64, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(131, 131, 243, 0.5)'
    ];

    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Expenses',
          data: amounts,
          backgroundColor: 'rgba(135, 206, 250, 0.6)'
        }]
      }
    });

    this.pieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          data: amounts,
          backgroundColor: softColors
        }]
      }
    });
  }

  get filteredExpenses() {
    return this.expenses.filter(exp => {
      const expDate = new Date(exp.date);
      const monthMatch = this.selectedMonth ? (('0' + (expDate.getMonth() + 1)).slice(-2) === this.selectedMonth) : true;
      const yearMatch = this.selectedYear ? (expDate.getFullYear().toString() === this.selectedYear) : true;
      const searchMatch = this.searchQuery ?
        (exp.category?.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
         exp.date.includes(this.searchQuery)) : true;

      return monthMatch && yearMatch && searchMatch;
    });
  }

  get paginatedExpenses() {
    const filtered = this.filteredExpenses;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.filteredExpenses.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  downloadExcelFromBackend() {
    this.expenseService.downloadExcel().subscribe(response => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Expense_Report.xlsx');
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

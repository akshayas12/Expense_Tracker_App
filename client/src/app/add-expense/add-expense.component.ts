// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ExpenseService } from '../services/expense.service';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-add-expense',
//   templateUrl: './add-expense.component.html',
//   styleUrls: ['./add-expense.component.css']
// })
// export class AddExpenseComponent implements OnInit {
//   categories: string[] = [];
//   expenses: any[] = [];
//   totalExpenses = 0;
//   expenseForm!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private expenseService: ExpenseService,
//     private http: HttpClient,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.expenseForm = this.fb.group({
//       category: ['', Validators.required],
//       amount: ['', [Validators.required, Validators.min(1)]]
//     });

//     this.loadExpenses();
//     this.expenseService.getCategories().subscribe(
//       (data) => {
//         if (data && Array.isArray(data.categories)) {
//           this.categories = data.categories; // Ensure it's an array of objects
//         } else {
//           console.error("Invalid categories response:", data);
//         }
//       },
//       (error) => console.error('Error fetching categories:', error)
//     );
    
//   }

//   addNewCategory(categoryName: string) {
//     this.expenseService.addCategory(categoryName).subscribe(
//       (response) => {
//         alert('Category added successfully!');
//         this.categories.push(categoryName); // Add to local list
//       },
//       (error) => {
//         console.error('Error adding category:', error);
//       }
//     );
//   }

//   loadExpenses() {
//     this.expenseService.getExpenses().subscribe(
//       (data) => {
//         this.expenses = Array.isArray(data) ? data : data.expenses || [];
//         this.calculateTotal();
//       },
//       (error) => console.error('Error fetching expenses:', error)
//     );
//   }

//   calculateTotal() {
//     this.totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
//   }

//   addExpense() {
//     if (this.expenseForm.invalid) {
//       alert("Category and amount are required.");
//       return;
//     }

//     const { category, amount } = this.expenseForm.value;

//     this.expenseService.addExpense(category, amount)
//       .subscribe(response => {
//         console.log('Expense added successfully:', response);
//         this.expenseForm.reset();
//       }, error => {
//         console.error('Error adding expense:', error);
//       });
//   }

//   logout() {
//     localStorage.removeItem('token');  // Clear token
//     this.router.navigate(['/login']);   // Redirect to login
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService, Category } from '../services/expense.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {
  categories: Category[] = [];
  expenses: any[] = [];
  totalExpenses = 0;
  expenseForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]]
    });

    this.loadExpenses();
    this.loadCategories();
  }

  loadCategories() {
    this.expenseService.getCategories().subscribe(
      (data) => {
        console.log('Categories data:', data);
        if (data && Array.isArray(data.categories)) {
          this.categories = data.categories;
        } else {
          console.error("Invalid categories response:", data);
          this.categories = [];
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.categories = [];
      }
    );
  }

  addNewCategory(categoryName: string) {
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    this.expenseService.addCategory(categoryName).subscribe(
      (response) => {
        alert('Category added successfully!');
        this.loadCategories();
      },
      (error) => {
        console.error('Error adding category:', error);
        alert('Error adding category. Please try again.');
      }
    );
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(
      (data) => {
        this.expenses = Array.isArray(data) ? data : data.expenses || [];
        this.calculateTotal();
      },
      (error) => console.error('Error fetching expenses:', error)
    );
  }

  calculateTotal() {
    this.totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  addExpense() {
    if (this.expenseForm.invalid) {
      alert("Category and amount are required.");
      return;
    }

    // Get values from form
    const categoryId = this.expenseForm.value.category;
    const amount = parseFloat(this.expenseForm.value.amount);
    
    // Debug information
    console.log('Form values:', this.expenseForm.value);
    console.log('Sending expense with categoryId:', categoryId);
    console.log('Sending expense with amount:', amount);
    
    // Call service
    this.expenseService.addExpense(categoryId, amount)
      .subscribe(
        response => {
          console.log('Expense added successfully:', response);
          alert('Expense added successfully!');
          this.expenseForm.reset();
          this.loadExpenses();
        }, 
        error => {
          console.error('Error adding expense:', error);
          const errorMsg = error.error?.message || 'Unknown error occurred';
          alert(`Error adding expense: ${errorMsg}`);
        }
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
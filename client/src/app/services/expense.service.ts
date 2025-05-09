
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  __v: number;
}

export interface CategoryResponse {
  categories: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:3000/expense';  

  constructor(private http: HttpClient) {}

  // Get all expenses
  getExpenses(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/getExpense`, { headers });
  }
    // API call to download the Excel file
    downloadExcel(): Observable<Blob> {
      const headers = this.getAuthHeaders();
      return this.http.get(`${this.apiUrl}/download-excel`, {
        headers,
        responseType: 'blob'
      });
    }
    

  // Add a new expense with debugging
  addExpense(categoryId: string, amount: number): Observable<any> {
    const headers = this.getAuthHeaders();
    
    // Create the request payload exactly as the backend expects it
    const payload = { category: categoryId, amount: amount };
    
    console.log('Sending expense payload:', payload);
    
    return this.http.post(`${this.apiUrl}/add-expense`, payload, { headers })
      .pipe(
        tap(
          response => console.log('Backend response:', response),
          error => console.log('Backend error details:', error)
        )
      );
  }

  // Fetch categories from backend with proper typing
  getCategories(): Observable<CategoryResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<CategoryResponse>(`${this.apiUrl}/getCategories`, { headers });
  }

  // Add a new category
  addCategory(newCategory: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/addCategory`, { name: newCategory }, { headers });
  }

  // Helper function to set Authorization header
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found. Please log in.');
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
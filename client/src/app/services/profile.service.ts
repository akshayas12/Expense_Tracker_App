import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token'); // or sessionStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get('https://expensetrackerbackend-7qyq.onrender.com/profile/getProfile', { headers });
  }

  updateProfile(userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put('https://expensetrackerbackend-7qyq.onrender.com/profile/updateProfile', userData, { headers });
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post('https://expensetrackerbackend-7qyq.onrender.com/profile/uploadProfileImage', formData, { headers });
  }
}

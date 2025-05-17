import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
private apiUrl='https://expensetrackerbackend-7qyq.onrender.com/userAuth'
  constructor(private http:HttpClient) { }
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
  verifyEmail(token: string) {
    return this.http.get(`https://expensetrackerbackend-7qyq.onrender.com/userAuth/verify-email?token=${token}`);
  }
  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }
  
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
private apiUrl='http://localhost:3000/userAuth'
  constructor(private http:HttpClient) { }
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
  verifyEmail(token: string) {
    return this.http.get(`http://localhost:3000/userAuth/verify-email?token=${token}`);
  }
  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }
  
}

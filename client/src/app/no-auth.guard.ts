import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/dashboard']); // already logged in, redirect
      return false;
    } else {
      return true; // not logged in, allow access
    }
  }
}

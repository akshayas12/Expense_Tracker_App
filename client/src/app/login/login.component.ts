import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  submit() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.snackBar.open('Login Successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']); // Change to your actual route
      },
      (error) => {
        this.snackBar.open(error.error.message || 'Login Failed', 'Close', { duration: 3000 });
      }
    );
  }
}

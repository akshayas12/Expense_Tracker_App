import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(    private fb: FormBuilder,
    private authService: AuthServiceService,
    private snackBar: MatSnackBar

  ){
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // confirmpass:['',[Validators.required,Validators.minLength(6)]]
    });
  }
  onRegister() {
    if (this.registerForm!.valid) { 
      this.authService.register(this.registerForm!.value).subscribe(
        (response) => {
          this.snackBar.open('Registration successful! Check your email.', 'Close', { duration: 3000 });
        },
        (error) => {
          this.snackBar.open(error.error.message, 'Close', { duration: 3000 });
        }
      );
    }
  }
  
}

import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent {
token:string=''
constructor(private route:ActivatedRoute,
private authService:AuthServiceService,
private router: Router,
private snackBar: MatSnackBar
){}
ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    this.token = params['token'];
  });
}
verifyEmail() {
  this.authService.verifyEmail(this.token).subscribe(
    (response) => {
      this.snackBar.open('Email verified! Redirecting to login...', 'Close', { duration: 3000 });
      setTimeout(() => this.router.navigate(['/login']), 3000);
    },
    (error) => {
      this.snackBar.open(error.error.message || 'Verification failed!', 'Close', { duration: 3000 });
    }
  );
}
}


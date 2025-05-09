import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { LoginComponent } from './login/login.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { AuthGuard } from './auth.guard';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ProfileComponent } from './profile/profile.component';
import { NoAuthGuard } from './no-auth.guard';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full'  },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'login', component: LoginComponent ,canActivate: [NoAuthGuard]},
  { 
    path: 'dashboard', 
    component: DashBoardComponent, 
    canActivate: [AuthGuard], 
    children: [
      { path: 'add-expense', component: AddExpenseComponent },
      { path: 'profile', component: ProfileComponent }  
    ] 
  },
  { path: 'addExpense', component: AddExpenseComponent,canActivate: [AuthGuard] },  
  { path: 'profile', component: ProfileComponent ,canActivate: [AuthGuard]} // Remove if it's inside 'dashboard'
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {} 

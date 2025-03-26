import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginResponse } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';
  messageClass = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: LoginResponse) => {
        this.message = 'Login successful, redirecting...';
        this.messageClass = 'success';
        setTimeout(() => this.router.navigate(['/home-page']), 1500);
      },
      error: () => {
        this.message = 'Login failed. Please try again.';
        this.messageClass = 'error';
      }
    });
  }
}

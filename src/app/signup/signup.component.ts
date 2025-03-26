import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  message: string = '';
  messageClass: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSignUp(): void {
    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match!';
      this.messageClass = 'error';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.message = 'Invalid email address!';
      this.messageClass = 'error';
      return;
    }

    const payload = {
      username: this.username,
      password: this.password,
      email: this.email
    };

    const signupUrl = `${environment.apiUrl}/auth/signup/`;

    this.http.post(signupUrl, payload, { observe: 'response' }).subscribe({
      next: (response) => {
        if (response.status === 201) {
          this.message = 'Signup successful! Redirecting to login...';
          this.messageClass = 'success';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          this.message = 'Signup failed. Please try again.';
          this.messageClass = 'error';
        }
      },
      error: () => {
        this.message = 'Signup failed. Please try again.';
        this.messageClass = 'error';
      }
    });
  }
}

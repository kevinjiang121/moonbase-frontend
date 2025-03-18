import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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

  constructor(private http: HttpClient, private router: Router) {}

  onSignUp(): void {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert('Invalid email address!');
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
          alert('Signup successful!');
          this.router.navigate(['/login']);
        } else {
          alert('Signup failed. Please try again.');
        }
      },
      error: (error) => {
        alert('Signup failed. Please try again.');
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';

  constructor(private http: HttpClient) {}

  onSignUp(): void {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const payload = {
      username: this.username,
      password: this.password,
      email: this.email
    };

    const signupUrl = `${environment.apiUrl}/users/signup/`;

    this.http.post(signupUrl, payload).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        alert('Signup successful!');
      },
      error: (error) => {
        console.error('Signup error:', error);
        alert('Signup failed. Please try again.');
      }
    });
  }
}

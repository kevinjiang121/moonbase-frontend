import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';

  constructor(private http: HttpClient) {}

  forgotPassword(): void {
    const url = `${environment.apiUrl}/auth/forgot-password/`;
    this.http
      .post<{ detail: string }>(url, { email: this.email })
      .subscribe({
        next: () => {
          this.message = 'A password reset link has been sent to your email.';
        },
        error: () => {
          this.message = 'Failed to send reset email. Please try again.';
        }
      });
  }
}

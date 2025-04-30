import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token: string | null = null;
  newPassword = '';
  confirmPassword = '';
  message = '';
  messageClass = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    });
  }

  onResetPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match!';
      this.messageClass = 'error';
      return;
    }

    const url = `${environment.apiUrl}/auth/reset-password/`;
    const body = {
      token: this.token,
      new_password: this.newPassword
    };

    this.http.post(url, body, { observe: 'response' }).subscribe({
      next: res => {
        if (res.status === 200) {
          this.message = 'Password reset successful! Redirecting to login...';
          this.messageClass = 'success';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.message = 'Reset failed. Please try again.';
          this.messageClass = 'error';
        }
      },
      error: () => {
        this.message = 'Reset failed. Please try again.';
        this.messageClass = 'error';
      }
    });
  }
}

// src/app/header/header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  loggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.loggedIn$ = this.authService.loggedIn$;
  }

  logout(): void {
    this.authService.logout();
  }
}

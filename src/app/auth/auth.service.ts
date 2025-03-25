import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

export interface LoginResponse {
  access_token: string;
  user: {
    user_id: number;
    username: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public loggedIn$ = this.loggedInSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const loginUrl = `${environment.apiUrl}/auth/login/`;
    const payload = { username, password };

    return this.http.post<LoginResponse>(loginUrl, payload).pipe(
      tap(response => {
        this.loggedInSubject.next(true);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', response.access_token);
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      return !!token;
    }
    return false;
  }  
}

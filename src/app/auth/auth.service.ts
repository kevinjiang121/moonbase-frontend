import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public loggedIn$ = this.loggedInSubject.asObservable();

  login(username: string, password: string): Observable<LoginResponse> {
    const loginUrl = `${environment.apiUrl}/users/login/`;
    const payload = { username, password };

    return this.http.post<LoginResponse>(loginUrl, payload).pipe(
      tap(response => {
        this.loggedInSubject.next(true);
        localStorage.setItem('authToken', response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.loggedInSubject.next(false);
  }
}

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth/auth.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule, FormsModule, HttpClientModule],
      providers: [AuthService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.login on successful login', waitForAsync(() => {
    spyOn(authService, 'login').and.returnValue(of({
      token: 'dummy-token',
      user: { id: 1, username: 'testuser' }
    }));

    component.username = 'testuser';
    component.password = 'password';
    component.onLogin();

    fixture.whenStable().then(() => {
      expect(authService.login).toHaveBeenCalledWith('testuser', 'password');
    });
  }));

  it('should handle login error by alerting the user', waitForAsync(() => {
    spyOn(window, 'alert');
    spyOn(authService, 'login').and.returnValue(throwError(() => new Error('Login failed')));

    component.username = 'testuser';
    component.password = 'wrongpassword';
    component.onLogin();

    fixture.whenStable().then(() => {
      expect(authService.login).toHaveBeenCalledWith('testuser', 'wrongpassword');
      expect(window.alert).toHaveBeenCalledWith('Login failed. Please try again.');
    });
  }));

  it('should redirect to home after successful login', waitForAsync(() => {
    spyOn(router, 'navigate');
    spyOn(authService, 'login').and.returnValue(of({
      token: 'dummy-token',
      user: { id: 1, username: 'testuser' }
    }));

    component.username = 'testuser';
    component.password = 'password';
    component.onLogin();

    fixture.whenStable().then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  }));
});

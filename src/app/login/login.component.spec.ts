import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule, FormsModule],
      providers: [
        {
          provide: AuthService,
          useValue: { login: jasmine.createSpy('login') }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login on onLogin and navigate on success', waitForAsync(() => {
    const dummyResponse = {
      access_token: 'dummy-token',
      user: { user_id: 1, username: 'test', email: 'test@test.com' }
    };
    (authService.login as jasmine.Spy).and.returnValue(of(dummyResponse));
    spyOn(router, 'navigateByUrl');

    component.username = 'test';
    component.password = 'password';
    component.onLogin();

    fixture.whenStable().then(() => {
      expect(authService.login).toHaveBeenCalledWith('test', 'password');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/home-page');
    });
  }));

  it('should alert on login failure', waitForAsync(() => {
    spyOn(window, 'alert');
    (authService.login as jasmine.Spy).and.returnValue(throwError(() => new Error('Login failed')));

    component.username = 'test';
    component.password = 'wrong';
    component.onLogin();

    fixture.whenStable().then(() => {
      expect(window.alert).toHaveBeenCalledWith('Login failed. Please try again.');
    });
  }));
});

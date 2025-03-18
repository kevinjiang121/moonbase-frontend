import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../environments/environment';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SignupComponent, HttpClientTestingModule, RouterTestingModule, FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the signup component', () => {
    expect(component).toBeTruthy();
  });

  it('should alert if passwords do not match', waitForAsync(() => {
    spyOn(window, 'alert');
    component.username = 'test';
    component.password = 'password1';
    component.confirmPassword = 'password2';
    component.email = 'test@example.com';

    component.onSignUp();
    fixture.whenStable().then(() => {
      expect(window.alert).toHaveBeenCalledWith('Passwords do not match!');
    });
  }));

  it('should alert if email is invalid', waitForAsync(() => {
    spyOn(window, 'alert');
    component.username = 'test';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.email = 'invalidemail';

    component.onSignUp();
    fixture.whenStable().then(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid email address!');
    });
  }));

  it('should send POST request and navigate on successful signup', waitForAsync(() => {
    spyOn(window, 'alert');
    spyOn(router, 'navigate');
    
    component.username = 'test';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.email = 'test@example.com';

    component.onSignUp();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/signup/`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 201, statusText: 'Created' });

    fixture.whenStable().then(() => {
      expect(window.alert).toHaveBeenCalledWith('Signup successful!');
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  }));

  it('should alert on signup failure', waitForAsync(() => {
    spyOn(window, 'alert');
    
    component.username = 'test';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.email = 'test@example.com';

    component.onSignUp();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/signup/`);
    req.flush({}, { status: 400, statusText: 'Bad Request' });

    fixture.whenStable().then(() => {
      expect(window.alert).toHaveBeenCalledWith('Signup failed. Please try again.');
    });
  }));
});

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
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    const routerTestingSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [SignupComponent, HttpClientTestingModule, RouterTestingModule, FormsModule],
      providers: [
        { provide: Router, useValue: routerTestingSpy }
      ]
    }).compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the signup component', () => {
    expect(component).toBeTruthy();
  });

  it('should alert if passwords do not match', () => {
    component.username = 'test';
    component.password = 'password1';
    component.confirmPassword = 'password2';
    component.email = 'test@example.com';
    component.onSignUp();
    expect(component.message).toEqual('Passwords do not match!');
    expect(component.messageClass).toEqual('error');
  });

  it('should alert if email is invalid', () => {
    component.username = 'test';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.email = 'invalidemail';
    
    component.onSignUp();

    expect(component.message).toEqual('Invalid email address!');
    expect(component.messageClass).toEqual('error');
  });

  it('should send POST request and navigate on successful signup', waitForAsync(() => {
    component.username = 'test';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.email = 'test@example.com';
    
    component.onSignUp();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signup/`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 201, statusText: 'Created' });
    
    fixture.whenStable().then(() => {
      expect(component.message).toEqual('Signup successful! Redirecting to login...');
      expect(component.messageClass).toEqual('success');
      setTimeout(() => {
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      }, 1500);
    });
  }));

  it('should alert on signup failure', waitForAsync(() => {
    component.username = 'test';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.email = 'test@example.com';
    
    component.onSignUp();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signup/`);
    expect(req.request.method).toBe('POST');

    req.flush({}, { status: 400, statusText: 'Bad Request' });
    
    fixture.whenStable().then(() => {
      expect(component.message).toEqual('Signup failed. Please try again.');
      expect(component.messageClass).toEqual('error');
    });
  }));
});

import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        FormsModule
      ]
    }).compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the signup component', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if passwords do not match', () => {
    component.username = 'test';
    component.password = 'password1';
    component.confirmPassword = 'password2';
    component.email = 'test@example.com';

    component.onSignUp();
    expect(component.message).toEqual('Passwords do not match!');
    expect(component.messageClass).toEqual('error');
  });

  it('should show error if email is invalid', () => {
    component.username = 'test';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.email = 'invalidemail';

    component.onSignUp();

    expect(component.message).toEqual('Invalid email address!');
    expect(component.messageClass).toEqual('error');
  });

  it('should send POST request and navigate on successful signup', fakeAsync(() => {
    component.username = 'test';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.email = 'test@example.com';
    
    spyOn(router, 'navigate');

    component.onSignUp();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signup/`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 201, statusText: 'Created' });
    tick(1500);
    fixture.detectChanges();

    expect(component.message).toEqual('Signup successful! Redirecting to login...');
    expect(component.messageClass).toEqual('success');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should show error on signup failure', fakeAsync(() => {
    component.username = 'test';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.email = 'test@example.com';
    
    component.onSignUp();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signup/`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 400, statusText: 'Bad Request' });
    tick();
    fixture.detectChanges();

    expect(component.message).toEqual('Signup failed. Please try again.');
    expect(component.messageClass).toEqual('error');
  }));
});

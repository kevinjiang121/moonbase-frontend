import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  const tokenValue = 'abc123';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ResetPasswordComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({ token: tokenValue }))
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component and read the token from query params', () => {
    expect(component).toBeTruthy();
    expect(component.token).toBe(tokenValue);
  });

  it('should show error when passwords do not match', () => {
    component.newPassword = 'password1';
    component.confirmPassword = 'password2';
    component.onResetPassword();

    expect(component.messageClass).toBe('error');
    expect(component.message).toBe('Passwords do not match!');
  });

  it('should POST new password and token to API and show success message', fakeAsync(() => {
    spyOn(router, 'navigate');
    component.newPassword = 'newPass123';
    component.confirmPassword = 'newPass123';

    component.onResetPassword();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/reset-password/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      token: tokenValue,
      new_password: 'newPass123'
    });

    req.flush({}, { status: 200, statusText: 'OK' });
    fixture.detectChanges();

    expect(component.messageClass).toBe('success');
    expect(component.message).toContain('Password reset successful');

    // simulate the setTimeout redirect
    tick(1500);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should show error message on HTTP failure', () => {
    component.newPassword = 'newPass123';
    component.confirmPassword = 'newPass123';

    component.onResetPassword();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/reset-password/`);
    req.flush({ detail: 'Invalid token' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    expect(component.messageClass).toBe('error');
    expect(component.message).toBe('Reset failed. Please try again.');
  });
});

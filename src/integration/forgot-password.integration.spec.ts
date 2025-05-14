import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AppComponent } from '../app/app.component';
import { routes } from '../app/app.routes';
import { ForgotPasswordComponent } from '../app/forgot-password/forgot-password.component';
import { environment } from '../environments/environment';

describe('Forgot‑Password Flow Integration', () => {
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        ForgotPasswordComponent,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should submit email and show confirmation message', fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    router.navigate(['/forgot-password']);
    tick(); fixture.detectChanges();

    const emailInput = fixture.debugElement.query(By.css('input[type="email"]')).nativeElement;
    const submitBtn  = fixture.debugElement.query(By.css('button')).nativeElement;

    emailInput.value = 'test@x.com'; emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    submitBtn.click();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/forgot-password/`);
    expect(req.request.method).toBe('POST');
    req.flush({ detail: 'sent' });

    tick(); fixture.detectChanges();
    const msg = fixture.debugElement.query(By.css('.forgot-password p')).nativeElement.textContent;
    expect(msg).toContain('password reset link');
  }));
});

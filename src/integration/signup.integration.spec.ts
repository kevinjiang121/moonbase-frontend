import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AppComponent } from '../app/app.component';
import { routes } from '../app/app.routes';
import { SignupComponent } from '../app/signup/signup.component';
import { environment } from '../environments/environment';

describe('Signup Flow Integration', () => {
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        SignupComponent,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fill out the form, POST signup, and redirect to login', fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    router.navigate(['/signup']);
    tick(); fixture.detectChanges();

    const userInput    = fixture.debugElement.query(By.css('input[placeholder="Username"]')).nativeElement;
    const passInput    = fixture.debugElement.query(By.css('input[placeholder="Password"]')).nativeElement;
    const confirmInput = fixture.debugElement.query(By.css('input[placeholder="Confirm Password"]')).nativeElement;
    const emailInput   = fixture.debugElement.query(By.css('input[placeholder="Email"]')).nativeElement;
    const submitBtn    = fixture.debugElement.query(By.css('button.btn')).nativeElement;

    userInput.value    = 'newuser';        userInput.dispatchEvent(new Event('input'));
    passInput.value    = 'secret';         passInput.dispatchEvent(new Event('input'));
    confirmInput.value = 'secret';         confirmInput.dispatchEvent(new Event('input'));
    emailInput.value   = 'a@b.com';        emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    submitBtn.click();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signup/`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 201, statusText: 'Created' });

    tick(1500); fixture.detectChanges();
    expect(router.url).toBe('/login');
  }));
});

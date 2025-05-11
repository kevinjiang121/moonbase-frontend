import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { AppComponent } from '../app/app.component';
import { routes } from '../app/app.routes';
import { LoginComponent } from '../app/login/login.component';
import { environment } from '../environments/environment';

describe('Login Flow Integration', () => {
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;
  let location: Location;
  let router: Router;
  let ngZone: NgZone;

  beforeEach(async () => {
    window.localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        LoginComponent,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
  });

  it('should log in, store token, and redirect to home-page', fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);

    ngZone.run(() => router.navigate(['/login']));
    tick();
    fixture.detectChanges();
    const usernameInput = fixture.debugElement.query(By.css('input[placeholder="Username"]')).nativeElement as HTMLInputElement;
    const passwordInput = fixture.debugElement.query(By.css('input[placeholder="Password"]')).nativeElement as HTMLInputElement;
    const loginButton   = fixture.debugElement.query(By.css('button.btn')).nativeElement as HTMLButtonElement;

    usernameInput.value = 'testuser';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    loginButton.click();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'password123' });

    const fakeResponse = {
      access_token: 'dummy-token',
      user: { user_id: 42, username: 'testuser', email: 'test@example.com' }
    };
    req.flush(fakeResponse);

    expect(window.localStorage.getItem('authToken')).toBe('dummy-token');

    fixture.detectChanges();
    const messageEl = fixture.debugElement.query(By.css('.success'));
    expect(messageEl).toBeTruthy();
    expect(messageEl.nativeElement.textContent).toContain('Login successful');

    tick(1500);
    fixture.detectChanges();
    expect(location.path()).toBe('/home-page');
  }));
});

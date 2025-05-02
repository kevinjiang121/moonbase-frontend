// src/integration/auth.integration.spec.ts

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AppComponent } from '../app/app.component';
import { routes } from '../app/app.routes';
import { LandingPageComponent } from '../app/landing-page/landing-page.component';
import { SignupComponent }      from '../app/signup/signup.component';
import { LoginComponent }       from '../app/login/login.component';

describe('Auth flow integration', () => {
  let fixture: ComponentFixture<AppComponent>;
  let router:  Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        LandingPageComponent,
        SignupComponent,
        LoginComponent,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ]
    }).compileComponents();

    router   = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate landing → signup → login', fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
    tick();
    fixture.detectChanges();

    expect(location.path()).toBe('/', 'Initial path should be "/"');
    expect(fixture.debugElement.query(By.css('.landing-page')))
      .withContext('Landing page did not render')
      .toBeTruthy();

    const signUpLink = fixture.debugElement.query(
      By.css('.bottom-box.bottom2 a')
    );
    expect(signUpLink)
      .withContext('Sign Up link not found')
      .toBeTruthy();
    signUpLink.nativeElement.click();
    tick();
    fixture.detectChanges();

    expect(location.path()).toBe('/signup', 'Should navigate to /signup');
    expect(fixture.debugElement.query(By.css('.signup-box')))
      .withContext('Signup form did not render')
      .toBeTruthy();
      
    const loginLink = fixture.debugElement.query(
      By.css('.login-link a')
    );
    expect(loginLink)
      .withContext('Login link on signup page not found')
      .toBeTruthy();
    loginLink.nativeElement.click();
    tick();
    fixture.detectChanges();
    expect(location.path()).toBe('/login', 'Should navigate to /login');
    expect(fixture.debugElement.query(By.css('.login-box')))
      .withContext('Login form did not render')
      .toBeTruthy();
  }));
});

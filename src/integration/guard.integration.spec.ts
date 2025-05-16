import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { Router, Routes } from '@angular/router';
import { NgZone } from '@angular/core';

import { AppComponent } from '../app/app.component';
import { HomePageComponent } from '../app/home-page/home-page.component';
import { LoginComponent } from '../app/login/login.component';
import { AuthGuard } from '../app/auth/auth.guard';
import { AuthService } from '../app/auth/auth.service';

const routes: Routes = [
  { path: 'login',      component: LoginComponent },
  { path: 'home-page',  component: HomePageComponent, canActivate: [AuthGuard] },
  { path: '**',         redirectTo: 'login' }
];

describe('AuthGuard Integration', () => {
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;
  let ngZone: NgZone;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        AuthGuard
      ]
    }).compileComponents();

    router      = TestBed.inject(Router);
    location    = TestBed.inject(Location);
    ngZone      = TestBed.inject(NgZone);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('redirects unauthenticated users to /login', fakeAsync(() => {
    authService.isLoggedIn.and.returnValue(false);
    fixture = TestBed.createComponent(AppComponent);
    ngZone.run(() => router.navigate(['/home-page']));
    tick();
    fixture.detectChanges();
    expect(location.path()).toBe('/login');
  }));

  it('allows authenticated users to access /home-page', fakeAsync(() => {
    authService.isLoggedIn.and.returnValue(true);
    fixture = TestBed.createComponent(AppComponent);
    ngZone.run(() => router.navigate(['/home-page']));
    tick();
    fixture.detectChanges();
    expect(location.path()).toBe('/home-page');
  }));
});

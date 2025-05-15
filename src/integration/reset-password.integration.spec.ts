// src/integration/reset-password.integration.spec.ts
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from '../app/app.component';
import { routes } from '../app/app.routes';
import { ResetPasswordComponent } from '../app/reset-password/reset-password.component';
import { environment } from '../environments/environment';

describe('Reset‑Password Flow Integration', () => {
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let ngZone: NgZone;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        ResetPasswordComponent,
        FormsModule,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({ token: 'T123' }))
          }
        }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router   = TestBed.inject(Router);
    ngZone   = TestBed.inject(NgZone);
    location = TestBed.inject(Location);
  });

  it('should reset password then redirect to login', fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    ngZone.run(() => router.navigateByUrl('/reset-password?token=T123'));
    tick(); fixture.detectChanges();
    const resetDe  = fixture.debugElement.query(By.directive(ResetPasswordComponent));
    const resetCmp = resetDe.componentInstance as ResetPasswordComponent;
    resetCmp.newPassword     = 'abc';
    resetCmp.confirmPassword = 'abc';
    fixture.detectChanges();
    resetDe.query(By.css('form'))!.triggerEventHandler('ngSubmit', {});
    fixture.detectChanges();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/reset-password/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token: 'T123', new_password: 'abc' });
    req.flush({}, { status: 200, statusText: 'OK' });
    tick(1500);
    fixture.detectChanges();
    expect(location.path()).toBe('/login');
  }));
  
});

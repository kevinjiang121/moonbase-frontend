import { TestBed, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from '../app/app.component';
import { routes } from '../app/app.routes';
import { Router } from '@angular/router';

describe('Auth flow integration', () => {
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should go from landing → signup → login via click()', fakeAsync(() => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.landing-page')).toBeTruthy();
    const signUpAnchor = el.querySelector<HTMLAnchorElement>('.bottom-box.bottom2 a')!;
    expect(signUpAnchor).toBeTruthy('Sign Up link not found');
    signUpAnchor.click();
    tick(); fixture.detectChanges();
    expect(el.querySelector('.signup-box')).toBeTruthy('Signup form did not render');
    const loginLink = el.querySelector<HTMLAnchorElement>('.login-link a')!;
    expect(loginLink).toBeTruthy('Login link on signup page not found');
    loginLink.click();
    tick(); fixture.detectChanges();
    expect(el.querySelector('.login-box')).toBeTruthy('Login form did not render');
  }));
});

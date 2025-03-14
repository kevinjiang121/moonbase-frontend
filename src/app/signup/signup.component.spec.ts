import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpMock: HttpTestingController;
  const expectedUrl = `${environment.apiUrl}/users/signup/`;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SignupComponent, HttpClientTestingModule]
    }).compileComponents();
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
  
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should alert when passwords do not match', waitForAsync(() => {
    spyOn(window, 'alert');
    component.username = 'testuser';
    component.password = 'password1';
    component.confirmPassword = 'password2';
    component.email = 'test@example.com';
    
    component.onSignUp();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(window.alert).toHaveBeenCalledWith('Passwords do not match!');
    });
  }));

  it('should call the correct signup endpoint', waitForAsync(() => {
    component.username = 'testuser';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.email = 'test@example.com';
  
    component.onSignUp();
    fixture.detectChanges();
  
    fixture.whenStable().then(() => {
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.url).toBe(expectedUrl);
      req.flush({ success: true });
    });
  }));

  it('should send a POST request when passwords match', waitForAsync(() => {
    component.username = 'testuser';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.email = 'test@example.com';
    
    component.onSignUp();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({
        username: 'testuser',
        password: 'password',
        email: 'test@example.com'
      });
      req.flush({ success: true });
    });
  }));

  it('should handle HTTP error gracefully', waitForAsync(() => {
    spyOn(window, 'alert');
    component.username = 'testuser';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.email = 'test@example.com';
    
    component.onSignUp();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const req = httpMock.expectOne(expectedUrl);
      req.error(new ErrorEvent('Network error'));
      fixture.detectChanges();
      expect(window.alert).toHaveBeenCalledWith('Signup failed. Please try again.');
    });
  }));
});

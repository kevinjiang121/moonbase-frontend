import { TestBed } from '@angular/core/testing';
import { AuthService, LoginResponse } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const expectedLoginUrl = `${environment.apiUrl}/users/login/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully and update login state', () => {
    const dummyResponse: LoginResponse = {
      token: 'dummy-token',
      user: { id: 1, username: 'testuser' }
    };

    let loggedIn = false;
    service.loggedIn$.subscribe(state => loggedIn = state);

    service.login('testuser', 'password').subscribe(response => {
      expect(response).toEqual(dummyResponse);
      expect(loggedIn).toBeTrue();
      expect(localStorage.getItem('authToken')).toBe('dummy-token');
    });

    const req = httpMock.expectOne(expectedLoginUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'password' });
    req.flush(dummyResponse);
  });

  it('should handle login error', () => {
    let errorResponse: any;
    service.login('testuser', 'wrongpassword').subscribe({
      error: (error) => errorResponse = error
    });
    const req = httpMock.expectOne(expectedLoginUrl);
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    expect(errorResponse.status).toBe(401);
  });
});

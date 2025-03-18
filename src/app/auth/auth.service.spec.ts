import { TestBed } from '@angular/core/testing';
import { AuthService, LoginResponse } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', () => {
    const dummyResponse: LoginResponse = {
      access_token: 'dummy-token',
      user: { user_id: 1, username: 'test', email: 'test@test.com' }
    };

    service.login('test', 'password').subscribe(response => {
      expect(response).toEqual(dummyResponse);
      expect(localStorage.getItem('authToken')).toBe('dummy-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login/`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should logout and remove token', () => {
    localStorage.setItem('authToken', 'dummy-token');
    service.logout();
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ForgotPasswordComponent', () => {
    expect(component).toBeTruthy();
  });
});
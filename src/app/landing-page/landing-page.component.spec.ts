import { TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('LandingPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LandingPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});

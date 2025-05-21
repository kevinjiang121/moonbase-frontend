import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { of, Subject } from 'rxjs';

import { AppComponent } from '../app/app.component';
import { routes } from '../app/app.routes';
import { HomePageComponent } from '../app/home-page/home-page.component';
import { AuthService } from '../app/auth/auth.service';
import { ChatService, ChatMessage } from '../app/chat/chat.service';
import { ChatWebSocketService } from '../app/chat/chat-websocket.service';

describe('HomePage Integration', () => {
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;
  let authSpy: jasmine.SpyObj<AuthService>;
  let chatServiceSpy: jasmine.SpyObj<ChatService>;
  let wsSpy: jasmine.SpyObj<ChatWebSocketService>;
  let wsSubject: Subject<ChatMessage>;

  const dummyMessages: ChatMessage[] = [
    { id: 1, channel: 1, author: 2, message: 'Hello', sent_at: new Date().toISOString(), username: 'Alice' }
  ];

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'getCurrentUser',
      'logout'
    ]);
    authSpy.isLoggedIn.and.returnValue(true);
    authSpy.getCurrentUser.and.returnValue({ user_id: 42, username: 'Test', email: 'test@example.com' });

    chatServiceSpy = jasmine.createSpyObj('ChatService', ['getChannelMessages']);
    wsSpy = jasmine.createSpyObj('ChatWebSocketService', ['connect', 'sendMessage', 'close']);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HomePageComponent,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: ChatWebSocketService, useValue: wsSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    wsSubject = new Subject<ChatMessage>();
    chatServiceSpy.getChannelMessages.and.returnValue(of(dummyMessages));
    wsSpy.connect.and.returnValue(wsSubject.asObservable());
    router.initialNavigation();
  });

  it('should load messages and receive websocket updates', fakeAsync(() => {
    router.navigate(['/home-page']);
    tick();
    fixture.detectChanges();
    expect(chatServiceSpy.getChannelMessages).toHaveBeenCalledWith(1);
    expect(wsSpy.connect).toHaveBeenCalledWith(1);

    const newMsg: ChatMessage = {
      id: 99,
      channel: 1,
      author: 3,
      message: 'New!',
      sent_at: new Date().toISOString(),
      username: 'Bob'
    };
    wsSubject.next(newMsg);
    tick();
    fixture.detectChanges();
    const bodies = fixture.nativeElement.querySelectorAll('.message-body');
    const last = bodies[bodies.length - 1];
    expect(last.textContent).toContain('New!');
  }));
});

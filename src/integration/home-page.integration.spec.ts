import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { Router, Routes } from '@angular/router';
import { NgZone } from '@angular/core';
import { of, Subject } from 'rxjs';

import { AppComponent } from '../app/app.component';
import { HomePageComponent } from '../app/home-page/home-page.component';
import { AuthService } from '../app/auth/auth.service';
import { ChatService, ChatMessage } from '../app/chat/chat.service';
import { ChatWebSocketService } from '../app/chat/chat-websocket.service';
import { LoginComponent } from '../app/login/login.component';
import { AuthGuard } from '../app/auth/auth.guard';

const routes: Routes = [
  { path: 'login',      component: LoginComponent },
  { path: 'home-page',  component: HomePageComponent, canActivate: [AuthGuard] },
  { path: '**',         redirectTo: 'login' }
];

describe('HomePage Integration', () => {
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;
  let ngZone: NgZone;
  let authService: jasmine.SpyObj<AuthService>;
  let chatService: jasmine.SpyObj<ChatService>;
  let wsService: jasmine.SpyObj<ChatWebSocketService>;
  let wsSubject: Subject<ChatMessage>;

  const dummyMessages: ChatMessage[] = [
    { id: 1, channel: 1, author: 2, message: 'Hello',    sent_at: new Date().toISOString(), username: 'Alice' },
    { id: 2, channel: 1, author: 3, message: 'World',    sent_at: new Date().toISOString(), username: 'Bob'   }
  ];

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    chatService = jasmine.createSpyObj('ChatService', ['getChannelMessages']);
    wsService   = jasmine.createSpyObj('ChatWebSocketService', ['connect', 'sendMessage', 'close']);
    chatService.getChannelMessages.and.returnValue(of(dummyMessages));
    wsSubject = new Subject<ChatMessage>();
    wsService.connect.and.returnValue(wsSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ChatService, useValue: chatService },
        { provide: ChatWebSocketService, useValue: wsService },
        AuthGuard
      ]
    }).compileComponents();

    router      = TestBed.inject(Router);
    location    = TestBed.inject(Location);
    ngZone      = TestBed.inject(NgZone);
  });

  it('loads initial messages and receives WebSocket updates', fakeAsync(() => {
    authService.getCurrentUser.and.returnValue({ user_id: 42, username: 'Test', email: 't@test' });
    fixture = TestBed.createComponent(AppComponent);
    ngZone.run(() => router.navigate(['/home-page']));
    tick(); fixture.detectChanges();
    const homeDe = fixture.debugElement.nativeElement as HTMLElement;
    expect(homeDe.textContent).toContain('Hello');
    expect(homeDe.textContent).toContain('World');

    const newMsg: ChatMessage = {
      id: 3, channel: 1, author: 99, message: 'New!', sent_at: new Date().toISOString(), username: 'Eve'
    };
    wsSubject.next(newMsg);
    tick(); fixture.detectChanges();
    expect(homeDe.textContent).toContain('New!');
  }));

  it('sends chat message via WebSocket when user sends one', fakeAsync(() => {
    authService.getCurrentUser.and.returnValue({ user_id: 42, username: 'Test', email: 't@test' });
    fixture = TestBed.createComponent(AppComponent);
    ngZone.run(() => router.navigate(['/home-page']));
    tick(); fixture.detectChanges();
    const sendStub = fixture.debugElement.query(el => !!el.componentInstance && 'messageSend' in el.componentInstance);
    sendStub.componentInstance.messageSend.emit('Hi there');
    tick(); fixture.detectChanges();
    expect(wsService.sendMessage).toHaveBeenCalledWith({ message: 'Hi there', user_id: 42 });
  }));
});

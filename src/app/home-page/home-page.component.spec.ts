import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { ChatService, ChatMessage } from '../chat/chat.service';
import { ChatWebSocketService } from '../chat/chat-websocket.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ChangeDetectorRef, NgZone } from '@angular/core';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  const dummyMessages: ChatMessage[] = [
    { id: 1, channel: 1, author: 2, message: 'Hello', sent_at: new Date().toISOString(), username: 'Alice' },
    { id: 2, channel: 1, author: 3, message: 'Hi', sent_at: new Date().toISOString(), username: 'Bob' }
  ];

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let chatServiceSpy: jasmine.SpyObj<ChatService>;
  let chatWebSocketServiceSpy: jasmine.SpyObj<ChatWebSocketService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let ngZone: NgZone;
  let cdRef: ChangeDetectorRef;
  let wsSubject: Subject<ChatMessage>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    const chatSpy = jasmine.createSpyObj('ChatService', ['getChannelMessages']);
    const wsSpy = jasmine.createSpyObj('ChatWebSocketService', ['connect', 'sendMessage', 'close']);
    const routerTestSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ChatService, useValue: chatSpy },
        { provide: ChatWebSocketService, useValue: wsSpy },
        { provide: Router, useValue: routerTestSpy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    chatServiceSpy = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
    chatWebSocketServiceSpy = TestBed.inject(ChatWebSocketService) as jasmine.SpyObj<ChatWebSocketService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    chatServiceSpy.getChannelMessages.and.returnValue(of(dummyMessages));
    authServiceSpy.getCurrentUser.and.returnValue({ user_id: 99, username: 'TestUser', email: 'test@test.com' });
    wsSubject = new Subject<ChatMessage>();
    chatWebSocketServiceSpy.connect.and.returnValue(wsSubject.asObservable());
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    ngZone = TestBed.inject(NgZone);
    cdRef = fixture.debugElement.injector.get(ChangeDetectorRef);

    fixture.detectChanges();
  });

  it('should create the home-page component', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial messages on ngOnInit and connect to WebSocket', fakeAsync(() => {
    expect(chatServiceSpy.getChannelMessages).toHaveBeenCalledWith(1);
    expect(component.messages.length).toBe(dummyMessages.length);
    expect(chatWebSocketServiceSpy.connect).toHaveBeenCalledWith(1);
    const newMessage: ChatMessage = { id: 3, channel: 1, author: 99, message: 'New message', sent_at: new Date().toISOString(), username: 'TestUser' };
    wsSubject.next(newMessage);
    ngZone.run(() => {}); 
    tick();
    fixture.detectChanges();
    expect(component.messages.length).toBe(dummyMessages.length + 1);
    expect(component.messages[component.messages.length - 1]).toEqual(newMessage);
  }));

  it('should call onMessageSend and send message with current user id', () => {
    const testMsg = 'Hello World';
    component.onMessageSend(testMsg);
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(chatWebSocketServiceSpy.sendMessage).toHaveBeenCalledWith({
      message: testMsg,
      user_id: 99
    });
  });

  it('should log an error and not send when no current user is returned', () => {
    spyOn(console, 'error');
    authServiceSpy.getCurrentUser.and.returnValue(null);
    component.onMessageSend('Test');
    expect(console.error).toHaveBeenCalledWith('No logged in user found! Cannot send message.');
    expect(chatWebSocketServiceSpy.sendMessage).not.toHaveBeenCalled();
  });

  it('should unsubscribe existing websocket and reconnect on channel selection', fakeAsync(() => {
    const fakeSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
    component['wsSubscription'] = fakeSubscription as any;
    chatWebSocketServiceSpy.close.calls.reset();
    component.onChannelSelected(2);
    tick();
    fixture.detectChanges();
    expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
    expect(chatWebSocketServiceSpy.close).toHaveBeenCalled();
    expect(component.selectedChannelId).toBe(2);
    expect(chatServiceSpy.getChannelMessages).toHaveBeenCalledWith(2);
    expect(chatWebSocketServiceSpy.connect).toHaveBeenCalledWith(2);
  }));

  it('should logout and navigate to login page when logOff is called', () => {
    component.logOff();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should unsubscribe from websocket and close connection on ngOnDestroy', () => {
    const fakeSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
    component['wsSubscription'] = fakeSubscription as any;
    chatWebSocketServiceSpy.close.calls.reset();
    component.ngOnDestroy();
    expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
    expect(chatWebSocketServiceSpy.close).toHaveBeenCalled();
  });
});

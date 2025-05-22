import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule }          from '@angular/router/testing';
import { HttpClientTestingModule }     from '@angular/common/http/testing';
import { Router }                      from '@angular/router';
import { Location }                    from '@angular/common';
import { By }                          from '@angular/platform-browser';
import { of, Subject }                 from 'rxjs';

import { AppComponent }                from '../app/app.component';
import { routes }                      from '../app/app.routes';
import { HomePageComponent }           from '../app/home-page/home-page.component';
import { AuthService }                 from '../app/auth/auth.service';
import { ChatService, ChatMessage }    from '../app/chat/chat.service';
import { ChatWebSocketService }        from '../app/chat/chat-websocket.service';

describe('Chat Integration', () => {
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;
  let authSpy: jasmine.SpyObj<AuthService>;
  let chatServiceSpy: jasmine.SpyObj<ChatService>;
  let wsSpy: jasmine.SpyObj<ChatWebSocketService>;
  let wsSubject: Subject<ChatMessage>;

  const initialMessages: ChatMessage[] = [
    { id: 1, channel: 1, author: 2, message: 'Hello', sent_at: new Date().toISOString(), username: 'Alice' }
  ];

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn','getCurrentUser','logout']);
    authSpy.isLoggedIn.and.returnValue(true);
    authSpy.getCurrentUser.and.returnValue({ user_id: 100, username: 'Tester', email: 'test@x.com' });

    chatServiceSpy = jasmine.createSpyObj('ChatService', ['getChannelMessages']);
    wsSpy           = jasmine.createSpyObj('ChatWebSocketService', ['connect','sendMessage','close']);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HomePageComponent,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService,          useValue: authSpy },
        { provide: ChatService,          useValue: chatServiceSpy },
        { provide: ChatWebSocketService, useValue: wsSpy }
      ]
    }).compileComponents();

    router   = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  beforeEach(() => {
    fixture     = TestBed.createComponent(AppComponent);
    wsSubject   = new Subject<ChatMessage>();
    chatServiceSpy.getChannelMessages.and.returnValue(of(initialMessages));
    wsSpy.connect.and.returnValue(wsSubject.asObservable());
    router.initialNavigation();
  });

  it('should display initial messages and allow sending new ones', fakeAsync(() => {
    router.navigate(['/home-page']);
    tick();
    fixture.detectChanges();
    const bodies = fixture.nativeElement.querySelectorAll('.message-body');
    expect(bodies.length).toBe(1);
    expect(bodies[0].textContent).toContain('Hello');
    const inputDE = fixture.debugElement.query(By.css('.chat-input input'));
    const inputEl = inputDE.nativeElement as HTMLInputElement;
    inputEl.value = 'Hey there!';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    inputEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    tick();
    fixture.detectChanges();
    expect(wsSpy.sendMessage).toHaveBeenCalledWith({
      message: 'Hey there!',
      user_id: 100
    });

    const incoming: ChatMessage = {
      id: 2, channel: 1, author: 3,
      message: 'Reply!', sent_at: new Date().toISOString(),
      username: 'Bob'
    };
    wsSubject.next(incoming);
    tick();
    fixture.detectChanges();

    const updatedBodies = fixture.nativeElement.querySelectorAll('.message-body');
    expect(updatedBodies.length).toBe(2);
    expect(updatedBodies[1].textContent).toContain('Reply!');
  }));
});

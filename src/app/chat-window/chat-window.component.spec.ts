import { Component, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChatWindowComponent } from './chat-window.component';
import { ChatMessage } from '../chat/chat.service';

@Component({
  selector: 'app-chat',
  template: `<div (click)="simulateSend()"></div>`
})
class ChatComponentStub {
  messageSend = new EventEmitter<string>();

  simulateSend(): void {
    this.messageSend.emit('stubbed message');
  }
}

describe('ChatWindowComponent', () => {
  let component: ChatWindowComponent;
  let fixture: ComponentFixture<ChatWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWindowComponent, ChatComponentStub]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWindowComponent);
    component = fixture.componentInstance;
    component.messages = [
      {
        id: 1,
        channel: 1,
        author: 2,
        message: 'Hello from Alice',
        sent_at: new Date().toISOString(),
        username: 'Alice'
      },
      {
        id: 2,
        channel: 1,
        author: 3,
        message: 'Hi from Bob',
        sent_at: new Date().toISOString(),
        username: 'Bob'
      }
    ];
    fixture.detectChanges();
  });

  it('should create the ChatWindowComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll to the bottom of the messages container after view check', () => {
    const containerEl = fixture.debugElement.query(By.css('.messages')).nativeElement as HTMLElement;
    Object.defineProperty(containerEl, 'scrollHeight', { value: 500, configurable: true });
    containerEl.scrollTop = 0;
    component.ngAfterViewChecked();
    expect(containerEl.scrollTop).toEqual(500);
  });

  it('should re-emit messageSend event when child ChatComponent stub emits a message', () => {
    spyOn(component.messageSend, 'emit');
    const chatDebugEl = fixture.debugElement.query(By.directive(ChatComponentStub));
    const chatStubInstance = chatDebugEl.componentInstance as ChatComponentStub;
    chatStubInstance.messageSend.emit('Hello from stub');
    fixture.detectChanges();
    expect(component.messageSend.emit).toHaveBeenCalledWith('Hello from stub');
  });

  it('should emit message when sendMessage is called with a non-empty trimmed message', () => {
    spyOn(component.messageSend, 'emit');
    const testMsg = '  Test Message  ';
    component.sendMessage(testMsg);
    expect(component.messageSend.emit).toHaveBeenCalledWith(testMsg);
  });

  it('should not emit a message when sendMessage is called with whitespace only', () => {
    spyOn(component.messageSend, 'emit');
    component.sendMessage('   ');
    expect(component.messageSend.emit).not.toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { By } from '@angular/platform-browser';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the chat component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit message when sendMessage is called with non-empty input', () => {
    spyOn(component.messageSend, 'emit');
    component.messageText = 'Hello World';
    component.sendMessage();
    expect(component.messageSend.emit).toHaveBeenCalledWith('Hello World');
    expect(component.messageText).toEqual('');
  });

  it('should not emit message when input is empty or whitespace', () => {
    spyOn(component.messageSend, 'emit');
    component.messageText = '   ';
    component.sendMessage();
    expect(component.messageSend.emit).not.toHaveBeenCalled();
    expect(component.messageText).toEqual('   ');
  });
});

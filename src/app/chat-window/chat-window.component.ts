import {
  Component, Input, Output, EventEmitter,
  AfterViewChecked, ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent],
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements AfterViewChecked {
  @Input() messages: string[] = [];
  @Input() username: string = 'testUser';
  @Output() messageSend = new EventEmitter<string>();
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  sendMessage(newMessage: string): void {
    if (newMessage.trim()) {
      this.messages.push(newMessage);
      this.messageSend.emit(newMessage);
    }
  }
  
  ngAfterViewChecked(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
}

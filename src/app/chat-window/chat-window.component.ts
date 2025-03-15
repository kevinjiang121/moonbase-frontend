import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, ChatComponent],
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent {
  @Input() messages: string[] = [];

  @Input() containerStyle: { [key: string]: string } = {};

  @Output() messageSend = new EventEmitter<string>();

  sendMessage(msg: string): void {
    this.messages.push(msg);
    this.messageSend.emit(msg);
  }
}

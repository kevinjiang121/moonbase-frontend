import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @Output() messageSend = new EventEmitter<string>();
  messageText: string = '';

  sendMessage(): void {
    if (this.messageText.trim()) {
      this.messageSend.emit(this.messageText);
      this.messageText = '';
    }
  }
}

import { Component } from '@angular/core';
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
  messageText: string = '';
  messages: string[] = [];

  sendMessage(): void {
    if (this.messageText.trim()) {
      this.messages.push(this.messageText);
      this.messageText = '';
    }
  }
}

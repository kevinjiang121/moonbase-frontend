import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { Chat } from '../chat/chat.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ChatWindowComponent, Chat],
  template: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  messages: string[] = [];

  onMessageSend(newMessage: string): void {
    this.messages.push(newMessage);
  }
}


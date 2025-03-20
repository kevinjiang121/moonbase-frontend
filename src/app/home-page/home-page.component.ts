import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelComponent } from '../channel/channel.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ChatWindowComponent, ChannelComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  messages: string[] = [];

  onMessageSend(newMessage: string): void {
    this.messages.push(newMessage);
  }
}

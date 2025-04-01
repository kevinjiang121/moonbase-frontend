import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelComponent } from '../channel/channel.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { ChatService, ChatMessage } from '../chat/chat.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ChatWindowComponent, ChannelComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  messages: ChatMessage[] = [];
  selectedChannelId: number = 1;

  constructor(
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  onChannelSelected(channelId: number): void {
    this.selectedChannelId = channelId;
    this.loadMessages();
  }

  loadMessages(): void {
    this.chatService.getChannelMessages(this.selectedChannelId).subscribe({
      next: (data: ChatMessage[]) => {
        this.messages = data;
      },
      error: () => {
        alert('Failed to load messages for the selected channel.');
      }
    });
  }

  onMessageSend(newMessage: string): void {
    const newChatMessage: ChatMessage = {
      id: Date.now(),
      channel: this.selectedChannelId,
      author: 0,
      content: newMessage,
      sent_at: new Date().toISOString()
    };
    this.messages.push(newChatMessage);
  }

  logOff(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

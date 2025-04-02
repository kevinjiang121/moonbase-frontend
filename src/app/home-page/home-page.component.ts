import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelComponent } from '../channel/channel.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { ChatService, ChatMessage } from '../chat/chat.service';
import { ChatWebSocketService } from '../chat/chat-websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ChatWindowComponent, ChannelComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  selectedChannelId: number = 1;
  private wsSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService,
    private chatWebSocketService: ChatWebSocketService
  ) {}

  ngOnInit(): void {
    this.loadInitialMessages();
    this.connectWebSocket();
  }

  ngOnDestroy(): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    this.chatWebSocketService.close();
  }

  onChannelSelected(channelId: number): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    this.chatWebSocketService.close();

    this.selectedChannelId = channelId;
    this.loadInitialMessages();
    this.connectWebSocket();
  }

  loadInitialMessages(): void {
    this.chatService.getChannelMessages(this.selectedChannelId).subscribe({
      next: (data: ChatMessage[]) => {
        this.messages = data;
      },
      error: () => {
        alert('Failed to load messages for the selected channel.');
      }
    });
  }

  connectWebSocket(): void {
    this.wsSubscription = this.chatWebSocketService.connect(this.selectedChannelId).subscribe({
      next: (message: ChatMessage) => {
        this.messages.push(message);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      }
    });
  }

  onMessageSend(newMessage: string): void {
    const payload = {
      message: newMessage,
      user_id: 1
    };
    this.chatWebSocketService.sendMessage(payload);
  }

  logOff(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

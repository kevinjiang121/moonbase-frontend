import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelComponent } from '../channel/channel.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ChatWindowComponent, ChannelComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  messages: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  onMessageSend(newMessage: string): void {
    this.messages.push(newMessage);
  }

  logOff(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

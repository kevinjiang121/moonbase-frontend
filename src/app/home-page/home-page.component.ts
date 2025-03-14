import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatComponent
  ],
  template: `
    <!-- Any other home-page content here -->
    <app-chat></app-chat> <!-- Add the chat at the bottom -->
  `,
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {}

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ChatMessage } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketService {
  private ws!: WebSocket;
  private messagesSubject = new Subject<ChatMessage>();

  public connect(channelId: number): Observable<ChatMessage> {
    if (this.ws) {
      this.ws.close();
    }

    const url = `ws://localhost:8000/ws/chats/${channelId}/`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected to channel', channelId);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const incoming: ChatMessage = {
          id: Date.now(),
          channel: channelId,
          author: data.user_id,
          message: data.message,
          sent_at: data.sent_at || new Date().toISOString()
        };
        this.messagesSubject.next(incoming);
      } catch (error) {
        console.error('Error parsing incoming WebSocket message:', error);
      }
    };

    this.ws.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event);
    };

    return this.messagesSubject.asObservable();
  }

  public sendMessage(payload: { message: string; user_id: number }): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    } else {
      console.error('WebSocket is not open. Unable to send message.');
    }
  }

  public close(): void {
    if (this.ws) {
      this.ws.close();
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ChatMessage {
  id: number;
  channel: number;
  author: number;
  message: string;
  sent_at: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'http://localhost:8000/api/chats/chats/';

  constructor(private http: HttpClient) {}

  getChannelMessages(channelId: number): Observable<ChatMessage[]> {
    return this.http.get<any[]>(`${this.baseUrl}?channel=${channelId}`).pipe(
      map(serverMessages => serverMessages.map(m => ({
        id: m.id,
        channel: m.channel,
        author: m.author,
        message: m.content,
        sent_at: m.sent_at,
        username: m.username
      })))
    );
  }
}

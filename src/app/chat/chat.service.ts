import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  id: number;
  channel: number;
  author: number;
  content: string;
  sent_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'http://localhost:8000/api/chats/chats/';

  constructor(private http: HttpClient) {}

  getChannelMessages(channelId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.baseUrl}?channel=${channelId}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChannelGroup {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Channel {
  id: number;
  name: string;
  description: string;
  channel_type: string;
  created_at: string;
  group: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getChannelGroups(): Observable<ChannelGroup[]> {
    return this.http.get<ChannelGroup[]>(`${this.baseUrl}/channels/get-channel-groups-list/`);
  }

  getChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.baseUrl}/channels/get-channels-list/`);
  }

  createChannel(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/channels/create-channel/`, data);
  }

  deleteChannel(pk: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/channels/delete-channel/${pk}/`);
  }

  createChannelGroup(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/channels/create-channel-group/`, data);
  }

  deleteChannelGroup(pk: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/channels/delete-channel-group/${pk}/`);
  }
}

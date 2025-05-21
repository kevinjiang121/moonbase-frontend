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
  constructor(private http: HttpClient) {}

  getChannelGroups(): Observable<ChannelGroup[]> {
    return this.http.get<ChannelGroup[]>(
      `${environment.apiUrl}/channels/get-channel-groups-list/`
    );
  }

  getChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(
      `${environment.apiUrl}/channels/get-channels-list/`
    );
  }

  createChannelGroup(data: {
    name: string;
    description: string;
  }): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/channels/create-channel-group/`,
      data
    );
  }

  createChannel(data: {
    name: string;
    channel_type: string;
    description?: string;
    group?: number;
  }): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/channels/create-channel/`,
      data
    );
  }

  deleteChannelGroup(groupId: number): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/channels/delete-channel-group/${groupId}/`
    );
  }

  deleteChannel(channelId: number): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/channels/delete-channel/${channelId}/`
    );
  }
}

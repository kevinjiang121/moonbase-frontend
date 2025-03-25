import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelService } from './channel.service';

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

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
  public channelGroups: ChannelGroup[] = [];
  public channels: Channel[] = [];
  public ungroupedChannels: Channel[] = [];
  public groupedChannels: { [groupId: number]: Channel[] } = {};

  constructor(private channelService: ChannelService) {}

  ngOnInit(): void {
    this.loadChannelGroups();
    this.loadChannels();
  }

  private loadChannelGroups(): void {
    this.channelService.getChannelGroups().subscribe((groups: ChannelGroup[]) => {
      this.channelGroups = groups;
    });
  }

  private loadChannels(): void {
    this.channelService.getChannels().subscribe((channels: Channel[]) => {
      this.channels = channels;
      this.ungroupedChannels = channels.filter(channel => channel.group === null);
      this.groupedChannels = {};
      channels.forEach(channel => {
        if (channel.group !== null) {
          if (!this.groupedChannels[channel.group]) {
            this.groupedChannels[channel.group] = [];
          }
          this.groupedChannels[channel.group].push(channel);
        }
      });
    });
  }
}

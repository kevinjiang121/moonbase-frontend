import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelService, Channel, ChannelGroup } from './channel.service';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
  @ViewChild('contextMenuRef') contextMenuRef!: ElementRef<HTMLDivElement>;

  channelGroups: ChannelGroup[] = [];
  channels: Channel[] = [];
  ungroupedChannels: Channel[] = [];
  groupedChannels: { [groupId: number]: Channel[] } = {};

  expandedGroups: { [groupId: number]: boolean } = {};

  contextMenuVisible: boolean = false;
  contextMenuX: number = 0;
  contextMenuY: number = 0;
  contextMenuMode: 'main' | 'createCategory' | 'createChannel' = 'main';

  newCategoryName: string = '';
  newCategoryDescription: string = '';

  newChannelName: string = '';
  newChannelDescription: string = '';
  newChannelGroupId: number | null = null;
  newChannelType: string = 'text';

  constructor(private channelService: ChannelService) {}

  ngOnInit(): void {
    this.loadChannelGroups();
    this.loadChannels();
  }

  loadChannelGroups(): void {
    this.channelService.getChannelGroups().subscribe((groups: ChannelGroup[]) => {
      this.channelGroups = groups;
    });
  }

  loadChannels(): void {
    this.channelService.getChannels().subscribe((channels: Channel[]) => {
      this.channels = channels;
      this.ungroupedChannels = channels.filter(ch => ch.group === null);
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

  toggleGroup(groupId: number): void {
    this.expandedGroups[groupId] = !this.expandedGroups[groupId];
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenuMode = 'main';
  }

  onContextMenuClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: HTMLElement): void {
    if (this.contextMenuRef && !this.contextMenuRef.nativeElement.contains(target)) {
      this.contextMenuVisible = false;
    }
  }

  showCreateCategory(): void {
    this.contextMenuMode = 'createCategory';
    this.newCategoryName = '';
    this.newCategoryDescription = '';
  }

  showCreateChannel(): void {
    this.contextMenuMode = 'createChannel';
    this.newChannelName = '';
    this.newChannelDescription = '';
    this.newChannelGroupId = null;
    this.newChannelType = 'text';
  }

  createChannelForGroup(groupId: number): void {
    this.contextMenuVisible = true;
    this.contextMenuMode = 'createChannel';
    this.newChannelName = '';
    this.newChannelDescription = '';
    this.newChannelGroupId = groupId;
    this.newChannelType = 'text';
  }

  submitCreateCategory(): void {
    if (!this.newCategoryName.trim()) {
      alert('Please enter a category name.');
      return;
    }
    const data = {
      name: this.newCategoryName.trim(),
      description: this.newCategoryDescription.trim()
    };
    this.channelService.createChannelGroup(data).subscribe({
      next: () => {
        alert('Category created successfully!');
        this.loadChannelGroups();
        this.loadChannels();
        this.contextMenuVisible = false;
      },
      error: () => alert('Failed to create category.')
    });
  }

  submitCreateChannel(): void {
    if (!this.newChannelName.trim()) {
      alert('Please enter a channel name.');
      return;
    }
    const data: any = {
      name: this.newChannelName.trim(),
      channel_type: this.newChannelType
    };
    if (this.newChannelDescription.trim()) {
      data.description = this.newChannelDescription.trim();
    }
    data.group = this.newChannelGroupId !== null ? this.newChannelGroupId : null;
    this.channelService.createChannel(data).subscribe({
      next: () => {
        alert('Channel created successfully!');
        this.loadChannelGroups();
        this.loadChannels();
        this.contextMenuVisible = false;
      },
      error: () => alert('Failed to create channel.')
    });
  }

  cancelContextMenu(): void {
    this.contextMenuMode = 'main';
  }
}

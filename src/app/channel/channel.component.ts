import { Component, OnInit, HostListener, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelService, Channel, ChannelGroup } from './channel.service';

type ContextMenuMode = 'main' | 'createCategory' | 'createChannel' | 'deleteChannel' | 'deleteGroup';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
  @ViewChild('contextMenuRef') contextMenuRef!: ElementRef<HTMLDivElement>;
  @Output() channelSelected = new EventEmitter<number>();

  channelGroups: ChannelGroup[] = [];
  channels: Channel[] = [];
  ungroupedChannels: Channel[] = [];
  groupedChannels: { [groupId: number]: Channel[] } = {};
  expandedGroups: { [groupId: number]: boolean } = {};

  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuMode: ContextMenuMode = 'main';

  newCategoryName = '';
  newCategoryDescription = '';
  newChannelName = '';
  newChannelDescription = '';
  newChannelGroupId: number | null = null;
  newChannelType = 'text';

  selectedChannelToDelete: Channel | null = null;
  selectedGroupToDelete: ChannelGroup | null = null;

  constructor(private channelService: ChannelService) {}

  ngOnInit(): void {
    this.loadChannelGroups();
    this.loadChannels();
  }

  loadChannelGroups(): void {
    this.channelService.getChannelGroups()
      .subscribe((groups: ChannelGroup[]) => {
        this.channelGroups = groups;
      });
  }

  loadChannels(): void {
    this.channelService.getChannels()
      .subscribe((channels: Channel[]) => {
        this.channels = channels;
        this.ungroupedChannels = channels.filter((ch: Channel) => ch.group === null);
        this.groupedChannels = {};
        channels.forEach((channel: Channel) => {
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

  onContainerContextMenu(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      target.closest('.channel-btn') ||
      target.closest('.group-btn') ||
      target.closest('.add-button')
    ) {
      return;
    }
    event.preventDefault();
    this.clearSelections();
    this.setMenuPosition(event);
    this.contextMenuMode = 'main';
    this.contextMenuVisible = true;
  }

  onChannelRightClick(event: MouseEvent, channel: Channel): void {
    event.preventDefault();
    event.stopPropagation();
    this.clearSelections();
    this.selectedChannelToDelete = channel;
    this.setMenuPosition(event);
    this.contextMenuMode = 'deleteChannel';
    this.contextMenuVisible = true;
  }

  onGroupRightClick(event: MouseEvent, group: ChannelGroup): void {
    event.preventDefault();
    event.stopPropagation();
    this.clearSelections();
    this.selectedGroupToDelete = group;
    this.setMenuPosition(event);
    this.contextMenuMode = 'deleteGroup';
    this.contextMenuVisible = true;
  }

  createChannelForGroup(event: MouseEvent, groupId: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.clearSelections();
    this.setMenuPosition(event);
    this.contextMenuMode = 'createChannel';
    this.newChannelName = '';
    this.newChannelDescription = '';
    this.newChannelGroupId = groupId;
    this.newChannelType = 'text';
    this.contextMenuVisible = true;
  }

  showCreateCategory(): void {
    this.clearSelections();
    this.contextMenuMode = 'createCategory';
    this.newCategoryName = '';
    this.newCategoryDescription = '';
  }

  showCreateChannel(): void {
    this.clearSelections();
    this.contextMenuMode = 'createChannel';
    this.newChannelName = '';
    this.newChannelDescription = '';
    this.newChannelGroupId = null;
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

  const data: {
    name: string;
    channel_type: string;
    description: string;
    group?: number;
  } = {
    name: this.newChannelName.trim(),
    channel_type: this.newChannelType,
    description: this.newChannelDescription.trim()
  };

  if (this.newChannelGroupId != null) {
    data.group = this.newChannelGroupId;
  }

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


  confirmDeleteChannel(): void {
    if (this.selectedChannelToDelete) {
      this.channelService.deleteChannel(this.selectedChannelToDelete.id).subscribe({
        next: () => {
          alert('Channel deleted successfully!');
          this.loadChannels();
          this.clearSelections();
          this.contextMenuVisible = false;
          this.contextMenuMode = 'main';
        },
        error: () => alert('Failed to delete channel.')
      });
    }
  }

  confirmDeleteGroup(): void {
    if (this.selectedGroupToDelete) {
      this.channelService.deleteChannelGroup(this.selectedGroupToDelete.id).subscribe({
        next: () => {
          alert('Channel group deleted successfully!');
          this.loadChannelGroups();
          this.loadChannels();
          this.clearSelections();
          this.contextMenuVisible = false;
          this.contextMenuMode = 'main';
        },
        error: () => alert('Failed to delete channel group.')
      });
    }
  }

  cancelContextMenu(): void {
    this.contextMenuVisible = false;
    this.clearSelections();
    this.contextMenuMode = 'main';
  }

  selectChannel(channel: Channel): void {
    this.channelSelected.emit(channel.id);
  }

  clearSelections(): void {
    this.selectedChannelToDelete = null;
    this.selectedGroupToDelete = null;
  }

  setMenuPosition(event: MouseEvent): void {
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
  }

  onContextMenuClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (
      this.contextMenuRef &&
      !this.contextMenuRef.nativeElement.contains(event.target as Node)
    ) {
      this.contextMenuVisible = false;
      this.clearSelections();
      this.contextMenuMode = 'main';
    }
  }
}

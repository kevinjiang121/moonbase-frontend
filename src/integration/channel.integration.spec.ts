import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ChannelComponent } from '../app/channel/channel.component';
import { ChannelService, ChannelGroup, Channel } from '../app/channel/channel.service';
import { AuthService } from '../app/auth/auth.service';

describe('Channel Integration', () => {
  let fixture: ComponentFixture<ChannelComponent>;
  let component: ChannelComponent;
  let authSpy: jasmine.SpyObj<AuthService>;
  let channelService: jasmine.SpyObj<ChannelService>;

  const dummyGroups: ChannelGroup[] = [
    { id: 1, name: 'Group1', description: 'desc1', created_at: '' }
  ];
  const dummyChannels: Channel[] = [
    { id: 10, name: 'Channel 1', description: 'desc', channel_type: 'text', created_at: '', group: null },
    { id: 11, name: 'Channel 2', description: 'desc', channel_type: 'text', created_at: '', group: 1 }
  ];

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    channelService = jasmine.createSpyObj('ChannelService', [
      'getChannelGroups',
      'getChannels',
      'createChannelGroup',
      'createChannel',
      'deleteChannel',
      'deleteChannelGroup'
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ChannelComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ChannelService, useValue: channelService }
      ]
    }).compileComponents();

    authSpy.isLoggedIn.and.returnValue(true);

    channelService.getChannelGroups.and.returnValue(of(dummyGroups));
    channelService.getChannels.and.returnValue(of(dummyChannels));

    fixture = TestBed.createComponent(ChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should list, create, and delete channels & groups', () => {
    expect(component.channelGroups).toEqual(dummyGroups);
    expect(component.groupedChannels[1].length).toBe(1);
    expect(component.ungroupedChannels.length).toBe(1);

    const newGroup = { id: 2, name: 'New Group', description: 'x', created_at: '' };
    channelService.createChannelGroup.and.returnValue(of(newGroup));
    component.newCategoryName = 'New Group';
    component.newCategoryDescription = 'x';
    component.submitCreateCategory();
    expect(channelService.createChannelGroup).toHaveBeenCalledWith({
      name: 'New Group',
      description: 'x'
    });

    const newChan = { id: 20, name: 'ChanA', description: '', channel_type: 'text', created_at: '', group: 2 };
    channelService.createChannel.and.returnValue(of(newChan));
    component.newChannelGroupId = 2;
    component.newChannelName = 'ChanA';
    component.newChannelDescription = '';
    component.submitCreateChannel();
    expect(channelService.createChannel).toHaveBeenCalledWith({
      name: 'ChanA',
      description: '',
      channel_type: 'text',
      group: 2
    });

    component.selectedChannelToDelete = dummyChannels[0];
    channelService.deleteChannel.and.returnValue(of({}));
    component.confirmDeleteChannel();
    expect(channelService.deleteChannel).toHaveBeenCalledWith(dummyChannels[0].id);
    component.selectedGroupToDelete = dummyGroups[0];
    channelService.deleteChannelGroup.and.returnValue(of({}));
    component.confirmDeleteGroup();
    expect(channelService.deleteChannelGroup).toHaveBeenCalledWith(dummyGroups[0].id);
  });
});

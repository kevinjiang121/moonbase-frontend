import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelComponent } from './channel.component';
import { ChannelService, Channel, ChannelGroup } from './channel.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ChannelComponent', () => {
  let component: ChannelComponent;
  let fixture: ComponentFixture<ChannelComponent>;
  let channelServiceSpy: jasmine.SpyObj<ChannelService>;
  const dummyGroups: ChannelGroup[] = [
    { id: 1, name: 'Group1', description: 'desc1', created_at: '' }
  ];

  const dummyChannels: Channel[] = [
    { id: 10, name: 'Channel 1', description: 'desc', channel_type: 'text', created_at: '', group: null },
    { id: 11, name: 'Channel 2', description: 'desc', channel_type: 'text', created_at: '', group: 1 }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ChannelService', [
      'getChannelGroups',
      'getChannels',
      'createChannelGroup',
      'createChannel',
      'deleteChannel',
      'deleteChannelGroup'
    ]);

    await TestBed.configureTestingModule({
      imports: [ChannelComponent],
      providers: [{ provide: ChannelService, useValue: spy }]
    }).compileComponents();

    channelServiceSpy = TestBed.inject(ChannelService) as jasmine.SpyObj<ChannelService>;
    channelServiceSpy.getChannelGroups.and.returnValue(of(dummyGroups));
    channelServiceSpy.getChannels.and.returnValue(of(dummyChannels));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the channel component', () => {
    expect(component).toBeTruthy();
  });

  it('should load channel groups and channels on init', () => {
    expect(component.channelGroups.length).toBe(1);
    expect(component.ungroupedChannels.length).toBe(1);
    expect(component.groupedChannels[1]).toBeDefined();
    expect(component.groupedChannels[1].length).toBe(1);
  });

  describe('Context Menu Behavior', () => {
    it('should show main menu when right-clicking on empty space in the container', () => {
      const containerEl = fixture.nativeElement.querySelector('.channel-display');
      const event = new MouseEvent('contextmenu', {
        clientX: 100,
        clientY: 150,
        bubbles: true
      });
      Object.defineProperty(event, 'target', { value: containerEl });
      containerEl.dispatchEvent(event);
      fixture.detectChanges();

      expect(component.contextMenuVisible).toBeTrue();
      expect(component.contextMenuMode).toBe('main');
      expect(component.contextMenuX).toEqual(100);
      expect(component.contextMenuY).toEqual(150);
    });

    it('should show delete channel menu when right-clicking on a channel', () => {
      const channelBtnDebug = fixture.debugElement.query(By.css('.channel-btn'));
      const event = new MouseEvent('contextmenu', {
        clientX: 120,
        clientY: 200,
        bubbles: true
      });
      spyOn(event, 'stopPropagation');
      channelBtnDebug.triggerEventHandler('contextmenu', event);
      fixture.detectChanges();

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component.contextMenuVisible).toBeTrue();
      expect(component.contextMenuMode).toBe('deleteChannel');
      expect(component.selectedChannelToDelete).toEqual(jasmine.objectContaining({ id: 10 }));
    });

    it('should show delete group menu when right-clicking on a group row', () => {
      const groupRowDebug = fixture.debugElement.query(By.css('.group-row'));
      const event = new MouseEvent('contextmenu', {
        clientX: 130,
        clientY: 210,
        bubbles: true
      });
      spyOn(event, 'stopPropagation');
      groupRowDebug.triggerEventHandler('contextmenu', event);
      fixture.detectChanges();

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component.contextMenuVisible).toBeTrue();
      expect(component.contextMenuMode).toBe('deleteGroup');
      expect(component.selectedGroupToDelete).toEqual(jasmine.objectContaining({ id: 1 }));
    });

    it('should show create channel menu when clicking the add button inside a group row', () => {
      const addButtonDebug = fixture.debugElement.query(By.css('.add-button'));
      const event = new MouseEvent('click', {
        clientX: 140,
        clientY: 220,
        bubbles: true
      });
      addButtonDebug.triggerEventHandler('click', event);
      fixture.detectChanges();

      expect(component.contextMenuVisible).toBeTrue();
      expect(component.contextMenuMode).toBe('createChannel');
      expect(component.newChannelGroupId).toEqual(1);
    });
  });

  describe('Channel Selection', () => {
    it('should emit selected channel id when channel button is clicked', () => {
      spyOn(component.channelSelected, 'emit');
      const channelBtnDebug = fixture.debugElement.query(By.css('.channel-btn'));
      channelBtnDebug.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(component.channelSelected.emit).toHaveBeenCalledWith(10);
    });
  })

  describe('Service Call Tests', () => {
    it('should call createChannelGroup when submitting a new category', () => {
      component.newCategoryName = 'New Cat';
      component.newCategoryDescription = 'New Desc';
      channelServiceSpy.createChannelGroup.and.returnValue(of({}));
      component.submitCreateCategory();
      expect(channelServiceSpy.createChannelGroup).toHaveBeenCalledWith({
        name: 'New Cat',
        description: 'New Desc'
      });
    });

    it('should call deleteChannel when confirming channel deletion', () => {
      component.selectedChannelToDelete = dummyChannels[0];
      channelServiceSpy.deleteChannel.and.returnValue(of({}));
      component.confirmDeleteChannel();
      expect(channelServiceSpy.deleteChannel).toHaveBeenCalledWith(10);
    });

    it('should call deleteChannelGroup when confirming group deletion', () => {
      component.selectedGroupToDelete = dummyGroups[0];
      channelServiceSpy.deleteChannelGroup.and.returnValue(of({}));
      component.confirmDeleteGroup();
      expect(channelServiceSpy.deleteChannelGroup).toHaveBeenCalledWith(1);
    });
  });
});

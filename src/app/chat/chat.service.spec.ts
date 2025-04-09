import { TestBed } from '@angular/core/testing';
import { ChatService, ChatMessage } from './chat.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8000/api/chats/chats/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService]
    });
    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the chat service', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET with the correct URL for a given channel id', () => {
    const channelId = 1;
    service.getChannelMessages(channelId).subscribe();
    const req = httpMock.expectOne(`${baseUrl}?channel=${channelId}`);
    expect(req.request.method).toBe('GET');
    req.flush([]); // flush an empty array response
  });

  it('should retrieve channel messages and map "content" to "message" correctly', () => {
    const channelId = 1;
    const dummyResponse = [
      {
        id: 1,
        channel: channelId,
        author: 42,
        content: 'Hello, world!',
        sent_at: '2020-01-01T00:00:00.000Z',
        username: 'Alice'
      },
      {
        id: 2,
        channel: channelId,
        author: 43,
        content: 'Hi there!',
        sent_at: '2020-01-01T01:00:00.000Z',
        username: 'Bob'
      }
    ];

    service.getChannelMessages(channelId).subscribe((messages: ChatMessage[]) => {
      expect(messages.length).toBe(2);
      expect(messages[0].id).toBe(1);
      expect(messages[0].channel).toBe(channelId);
      expect(messages[0].author).toBe(42);
      expect(messages[0].message).toBe('Hello, world!');
      expect(messages[0].sent_at).toBe('2020-01-01T00:00:00.000Z');
      expect(messages[0].username).toBe('Alice');

      expect(messages[1].id).toBe(2);
      expect(messages[1].author).toBe(43);
      expect(messages[1].message).toBe('Hi there!');
      expect(messages[1].username).toBe('Bob');
    });

    const req = httpMock.expectOne(`${baseUrl}?channel=${channelId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should propagate error when getChannelMessages fails', () => {
    const channelId = 1;
    const errorMessage = 'Network error';
    service.getChannelMessages(channelId).subscribe({
      next: () => fail('Expected error, but got messages'),
      error: error => {
        expect(error).toBeTruthy();
      }
    });
    const req = httpMock.expectOne(`${baseUrl}?channel=${channelId}`);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});

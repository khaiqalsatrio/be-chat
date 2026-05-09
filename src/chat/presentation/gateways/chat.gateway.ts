import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from '../../core/usecases/chat.service';
import { MessageType } from '../../core/entities/message.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) throw new UnauthorizedException();

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'secretKey',
      });
      client.data.user = payload;
      
      client.join(`user_${payload.sub}`);
      console.log(`Client connected: ${client.id} (User: ${payload.sub})`);
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    return { event: 'joined', data: data.roomId };
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { roomId: string; content: string; type?: MessageType },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.sub;
    const message = await this.chatService.sendMessage(
      userId,
      data.roomId,
      data.content,
      data.type || MessageType.TEXT,
    );

    this.server.to(data.roomId).emit('receive_message', message);
    return message;
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.sub;
    client.to(data.roomId).emit('user_typing', { userId, roomId: data.roomId, isTyping: true });
  }

  @SubscribeMessage('typing_end')
  handleTypingEnd(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.sub;
    client.to(data.roomId).emit('user_typing', { userId, roomId: data.roomId, isTyping: false });
  }

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @MessageBody() data: { roomId: string; messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.sub;
    await this.chatService.markAsRead(userId, data.messageId, data.roomId);
    
    this.server.to(data.roomId).emit('message_read', { 
      messageId: data.messageId, 
      userId, 
      roomId: data.roomId 
    });
  }
}

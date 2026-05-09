import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { RoomRepositoryInterface } from './room-repository.interface';
import type { MessageRepositoryInterface } from './message-repository.interface';
import { Room, RoomType } from '../entities/room.entity';
import { Message, MessageType } from '../entities/message.entity';
import { DeliveryStatus } from '../entities/message-status.entity';

@Injectable()
export class ChatService {
  constructor(
    @Inject('RoomRepositoryInterface')
    private readonly roomRepository: RoomRepositoryInterface,
    @Inject('MessageRepositoryInterface')
    private readonly messageRepository: MessageRepositoryInterface,
  ) {}

  async createDirectChat(user1Id: string, user2Id: string): Promise<Room> {
    const rooms = await this.roomRepository.findUserRooms(user1Id);
    const existing = rooms.find(r => 
      r.type === RoomType.DIRECT && 
      r.participants.some(p => p.user_id === user2Id)
    );
    if (existing) return existing;

    const room = await this.roomRepository.createRoom({ type: RoomType.DIRECT });
    await this.roomRepository.addParticipant({ room_id: room.id, user_id: user1Id });
    await this.roomRepository.addParticipant({ room_id: room.id, user_id: user2Id });
    
    const createdRoom = await this.roomRepository.findById(room.id);
    if (!createdRoom) throw new NotFoundException('Room not found after creation');
    return createdRoom;
  }

  async sendMessage(userId: string, roomId: string, content: string, type: MessageType = MessageType.TEXT): Promise<Message> {
    const participant = await this.roomRepository.findParticipant(roomId, userId);
    if (!participant) throw new ForbiddenException('You are not a member of this room');

    const message = await this.messageRepository.create({
      room_id: roomId,
      sender_id: userId,
      content,
      type,
    });

    const createdMessage = await this.messageRepository.findById(message.id);
    if (!createdMessage) throw new NotFoundException('Message not found after creation');
    return createdMessage;
  }

  async getMessages(userId: string, roomId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
    const participant = await this.roomRepository.findParticipant(roomId, userId);
    if (!participant) throw new ForbiddenException('You are not a member of this room');

    return this.messageRepository.findByRoom(roomId, limit, offset);
  }

  async markAsRead(userId: string, messageId: string, roomId: string) {
    const participant = await this.roomRepository.findParticipant(roomId, userId);
    if (!participant) throw new ForbiddenException('You are not a member of this room');

    return this.messageRepository.updateStatus(messageId, userId, DeliveryStatus.READ);
  }

  async getUserRooms(userId: string): Promise<Room[]> {
    return this.roomRepository.findUserRooms(userId);
  }
}

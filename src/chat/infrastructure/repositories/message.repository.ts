import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../core/entities/message.entity';
import { MessageStatus, DeliveryStatus } from '../../core/entities/message-status.entity';
import { MessageRepositoryInterface } from '../../core/usecases/message-repository.interface';

@Injectable()
export class MessageRepository implements MessageRepositoryInterface {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(MessageStatus)
    private readonly statusRepo: Repository<MessageStatus>,
  ) {}

  async create(messageData: Partial<Message>): Promise<Message> {
    const message = this.messageRepo.create(messageData);
    return this.messageRepo.save(message);
  }

  async findById(id: string): Promise<Message | null> {
    return this.messageRepo.findOne({
      where: { id },
      relations: ['sender', 'statuses'],
    });
  }

  async findByRoom(roomId: string, limit: number, offset: number): Promise<Message[]> {
    return this.messageRepo.find({
      where: { room_id: roomId },
      relations: ['sender'],
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async updateStatus(messageId: string, userId: string, status: DeliveryStatus): Promise<MessageStatus> {
    let messageStatus = await this.statusRepo.findOne({
      where: { message_id: messageId, user_id: userId },
    });

    if (!messageStatus) {
      messageStatus = this.statusRepo.create({
        message_id: messageId,
        user_id: userId,
        status,
      });
    } else {
      messageStatus.status = status;
    }

    return this.statusRepo.save(messageStatus);
  }
}

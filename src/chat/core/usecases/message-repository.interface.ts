import { Message } from '../entities/message.entity';
import { MessageStatus } from '../entities/message-status.entity';

export interface MessageRepositoryInterface {
  create(message: Partial<Message>): Promise<Message>;
  findById(id: string): Promise<Message | null>;
  findByRoom(roomId: string, limit: number, offset: number): Promise<Message[]>;
  updateStatus(messageId: string, userId: string, status: string): Promise<MessageStatus>;
}

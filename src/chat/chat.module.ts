import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './core/usecases/chat.service';
import { ChatGateway } from './presentation/gateways/chat.gateway';
import { ChatController } from './presentation/controllers/chat.controller';
import { RoomRepository } from './infrastructure/repositories/room.repository';
import { MessageRepository } from './infrastructure/repositories/message.repository';
import { Room } from './core/entities/room.entity';
import { RoomParticipant } from './core/entities/room-participant.entity';
import { Message } from './core/entities/message.entity';
import { MessageStatus } from './core/entities/message-status.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomParticipant, Message, MessageStatus]),
    AuthModule,
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatService,
    {
      provide: 'RoomRepositoryInterface',
      useClass: RoomRepository,
    },
    {
      provide: 'MessageRepositoryInterface',
      useClass: MessageRepository,
    },
  ],
  exports: [ChatService],
})
export class ChatModule {}

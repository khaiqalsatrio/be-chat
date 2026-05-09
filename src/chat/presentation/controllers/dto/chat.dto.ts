import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { MessageType } from '../../../core/entities/message.entity';

export class CreateDirectChatDto {
  @ApiProperty({ example: 'uuid-of-target-user' })
  @IsNotEmpty()
  @IsString()
  targetUserId: string;
}

export class SendMessageDto {
  @ApiProperty({ example: 'Hello world' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ enum: MessageType, required: false, default: MessageType.TEXT })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;
}

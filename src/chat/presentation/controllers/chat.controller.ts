import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ChatService } from '../../core/usecases/chat.service';
import { JwtAuthGuard } from '../../../auth/presentation/middlewares/jwt-auth.guard';
import { MessageType } from '../../core/entities/message.entity';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getRooms(@Request() req) {
    return this.chatService.getUserRooms(req.user.id);
  }

  @Post('direct')
  async createDirectChat(@Request() req, @Body() data: { targetUserId: string }) {
    return this.chatService.createDirectChat(req.user.id, data.targetUserId);
  }

  @Get(':roomId/messages')
  async getMessages(
    @Request() req,
    @Param('roomId') roomId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return this.chatService.getMessages(req.user.id, roomId, limit, offset);
  }

  @Post(':roomId/messages')
  async sendMessage(
    @Request() req,
    @Param('roomId') roomId: string,
    @Body() data: { content: string; type?: MessageType },
  ) {
    return this.chatService.sendMessage(req.user.id, roomId, data.content, data.type);
  }
}

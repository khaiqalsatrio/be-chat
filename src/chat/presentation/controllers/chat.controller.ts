import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ChatService } from '../../core/usecases/chat.service';
import { JwtAuthGuard } from '../../../auth/presentation/middlewares/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateDirectChatDto, SendMessageDto } from './dto/chat.dto';

@ApiTags('Chats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiOperation({ summary: 'Get all rooms for the current user' })
  @ApiResponse({ status: 200, description: 'List of user rooms retrieved successfully' })
  async getRooms(@Request() req) {
    return this.chatService.getUserRooms(req.user.id);
  }

  @Post('direct')
  @ApiOperation({ summary: 'Create or get a direct chat with another user' })
  @ApiResponse({ status: 201, description: 'Direct chat created or retrieved' })
  async createDirectChat(@Request() req, @Body() data: CreateDirectChatDto) {
    return this.chatService.createDirectChat(req.user.id, data.targetUserId);
  }

  @Get(':roomId/messages')
  @ApiOperation({ summary: 'Get messages for a specific room' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getMessages(
    @Request() req,
    @Param('roomId') roomId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return this.chatService.getMessages(req.user.id, roomId, limit, offset);
  }

  @Post(':roomId/messages')
  @ApiOperation({ summary: 'Send a message to a room' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  async sendMessage(
    @Request() req,
    @Param('roomId') roomId: string,
    @Body() data: SendMessageDto,
  ) {
    return this.chatService.sendMessage(req.user.id, roomId, data.content, data.type);
  }
}

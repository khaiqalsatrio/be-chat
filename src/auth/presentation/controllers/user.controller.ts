import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { UserService } from '../../core/usecases/user.service';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All users retrieved' })
  async findAll(@Request() req) {
    return this.userService.getAllUsers(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('search')
  @ApiOperation({ summary: 'Search for users by username or email' })
  @ApiQuery({ name: 'q', description: 'Search query (username or email)' })
  @ApiResponse({ status: 200, description: 'Users found' })
  async search(@Query('q') query: string, @Request() req) {
    if (!query) {
      return [];
    }
    return this.userService.searchUsers(query, req.user.id);
  }
}

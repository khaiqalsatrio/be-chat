import { Controller, Get, Put, Body, Query, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from '../../core/usecases/user.service';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';

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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req: any, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const userId = req.user ? req.user.id : 'user';
        cb(null, `${userId}-${uniqueSuffix}${ext}`);
      }
    })
  }))
  @ApiOperation({ summary: 'Update user profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        bio: { type: 'string' },
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @Request() req,
    @Body() body: { username?: string; bio?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateData: any = { ...body };
    if (file) {
      updateData.avatar_url = `/uploads/avatars/${file.filename}`;
    }
    return this.userService.updateProfile(req.user.id, updateData);
  }
}

import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/CreateMessage.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(@Body() dto: CreateMessageDto) {
    return this.chatService.createMessage(dto);
  }

  @Get()
  async getMessages(@Query('user1') user1: string, @Query('user2') user2: string) {
    return this.chatService.getMessagesBetweenUsers(user1, user2);
  }
}

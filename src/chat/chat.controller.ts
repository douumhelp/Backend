import { Controller, Get, Post, Body, Query, Param, NotFoundException, Patch, ValidationPipe, UseGuards, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/CreateMessage.dto';
import { Message } from './message.entity';
import { UpdateMessageDto } from './dto/UpdateMessage.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(@Body() dto: CreateMessageDto) {
    return this.chatService.createMessage(dto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    console.log('Arquivo recebido:', file);
    return { filePath: `/uploads/${file.filename}` };
  }

  //esse Get é essencial para o próximo Get('message/:id'), Apesar de ele retornar um array vazio, favor não apagar.
  @Get()
  async getMessages(@Query('user1') user1: string, @Query('user2') user2: string) {
    return this.chatService.getMessagesBetweenUsers(user1, user2);
  }

  @Get('message/:id')
  async getMessageById(@Param('id') id: string): Promise<Message> {
    const message = await this.chatService.findMessageById(id);

    if(!message) {
      throw new NotFoundException('Mensage not found');
    }

    return message;
  }

  @Delete('message/:id')
  async deleteMessage(@Param('id') id: string): Promise<{message: string}> {
    await this.chatService.deleteMessage(id);
    return { message: 'mensage delete' };
  }

  @Patch('message/:id')
  async updateMessageContent(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    return this.chatService.updateMessageContent(id, updateMessageDto.content);
  }
}
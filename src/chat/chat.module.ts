import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { ChatController } from './chat.controller';
import { UserPF } from 'src/userpf/userpf.entity';
import { UserPJ } from 'src/userpj/userpj.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, UserPF, UserPJ]),
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}

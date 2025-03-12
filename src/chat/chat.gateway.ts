import {WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/CreateMessage.dto';
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:8081'], 
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
})

export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => ChatService)) private chatService: ChatService,
  ) {}

  handleConnect(@ConnectedSocket() client: Socket) {
    console.log(`Usuário conectado: ${client.id}`);
    
    client.emit('connection', { message: 'Conexão estabelecida com sucesso!' });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() dto: CreateMessageDto) {
    const senderPF = await this.chatService.isUserPF(dto.senderId);
    const senderPJ = await this.chatService.isUserPJ(dto.senderId);
    const receiverPF = await this.chatService.isUserPF(dto.receiverId);
    const receiverPJ = await this.chatService.isUserPJ(dto.receiverId);

    if ((senderPF && receiverPF) || (senderPJ && receiverPJ)) {
      throw new BadRequestException('Mensagens só podem ser enviadas entre um usuário PF e um usuário PJ.');
    }

    const message = await this.chatService.createMessage(dto);

    const messageEvent = `receiveMessage:${dto.receiverId}`;
    this.server.emit(messageEvent, message);

    const notificationEvent = `newNotification:${dto.receiverId}`;
    const notification = {
      message: `Nova mensagem de ${dto.senderId}`,
      senderId: dto.senderId,
    };

    this.server.emit(notificationEvent, notification);
  }
}

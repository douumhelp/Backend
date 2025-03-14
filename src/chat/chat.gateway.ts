import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/CreateMessage.dto';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, forwardRef, Inject } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
  user?: { id: string };
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
   @Inject(forwardRef(() => ChatService )) private chatService: ChatService,
   @Inject(forwardRef(() => JwtService )) private  jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    const token = client.handshake.auth?.token || client.handshake.query?.token;
    console.log('Token recebido:', token); 

    if (!token) {
      console.log('Client disconnected: No token provided');
      return client.disconnect();
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      console.log('Token decodificado:', decoded); 
      client.user = { id: decoded.sub }; 
      console.log(`Client connected: ${client.id}, User ID: ${decoded.sub}`);
    } catch (error) {
      console.error('Authentication error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.user) {
      throw new BadRequestException('Usuário não autenticado.');
    }

    dto.senderId = client.user.id;

    const senderPF = await this.chatService.isUserPF(dto.senderId);
    const senderPJ = await this.chatService.isUserPJ(dto.senderId);
    const receiverPF = await this.chatService.isUserPF(dto.receiverId);
    const receiverPJ = await this.chatService.isUserPJ(dto.receiverId);

    if ((senderPF && receiverPF) || (senderPJ && receiverPJ)) {
      throw new BadRequestException('Mensagens só podem ser enviadas entre um usuário PF e um usuário PJ.');
    }

    const message = await this.chatService.createMessage(dto);

    this.server.to(dto.receiverId).emit('receiveMessage', message);

    this.server.to(dto.receiverId).emit('newNotification', {
      message: `Nova mensagem de ${dto.senderId}`,
      senderId: dto.senderId,
    });
  }
}

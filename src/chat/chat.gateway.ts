import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/CreateMessage.dto';

@WebSocketGateway(3002, {
  cors: {
    origin: '*',
  },
  host: '0.0.0.0', 
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log('🔌 Conexão recebida de:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('❌ Cliente desconectado:', client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() dto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    console.log('🔵 Recebendo mensagem:', dto);
    
    const message = await this.chatService.createMessage(dto);
    console.log('✅ Mensagem salva no banco:', message);

    const messageEvent = `receiveMessage:${dto.receiverId}`;
    this.server.emit(messageEvent, message);
    console.log(`📩 Mensagem emitida no evento: ${messageEvent}`);

    const notificationEvent = `newNotification:${dto.receiverId}`;
    const notification = {
      message: `Nova mensagem de ${dto.senderId}`,
      senderId: dto.senderId,
    };

    this.server.emit(notificationEvent, notification);
    console.log(`🔔 Notificação emitida no evento: ${notificationEvent}`, notification);
  }
}


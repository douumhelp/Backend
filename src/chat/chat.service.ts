import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/CreateMessage.dto';
import { UserPF } from '../userpf/userpf.entity';
import { UserPJ } from '../userpj/userpj.entity';
import { ChatGateway } from './chat.gateway';
import * as fs from 'fs';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(UserPF)
    private userPFRepository: Repository<UserPF>,
    @InjectRepository(UserPJ)
    private userPJRepository: Repository<UserPJ>,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
  ) {}

  async createMessage(dto: CreateMessageDto): Promise<Message> {
    if (dto.senderId === dto.receiverId) {
      throw new BadRequestException('Você não pode enviar mensagens para si mesmo.');
    }
  
    const message = new Message();
    message.content = dto.content;
  
    const senderPF = await this.userPFRepository.findOne({ where: { id: dto.senderId } });
    const senderPJ = await this.userPJRepository.findOne({ where: { id: dto.senderId } });
  
    const receiverPF = await this.userPFRepository.findOne({ where: { id: dto.receiverId } });
    const receiverPJ = await this.userPJRepository.findOne({ where: { id: dto.receiverId } });
  
    if (!senderPF && !senderPJ) {
      throw new BadRequestException('Remetente não encontrado.');
    }
  
    if (!receiverPF && !receiverPJ) {
      throw new BadRequestException('Destinatário não encontrado.');
    }
  
    if ((senderPF && receiverPF) || (senderPJ && receiverPJ)) {
      throw new BadRequestException('Usuários do mesmo tipo (PF para PF ou PJ para PJ) não podem enviar mensagens entre si.');
    }
  
    if (senderPF) {
      message.senderPF = senderPF;
    } else {
      message.senderPJ = senderPJ;
    }
  
    if (receiverPF) {
      message.receiverPF = receiverPF;
    } else {
      message.receiverPJ = receiverPJ;
    }

    const savedMessage = await this.messageRepository.save(message);
  
    this.chatGateway.server.to(dto.receiverId).emit('receiveMessage', savedMessage);
  
    return savedMessage;
  }  

  private async saveFile(fileBase64: string): Promise<string> {
    const buffer = Buffer.from(fileBase64, 'base64');
    const filePath = `uploads/${Date.now()}.png`; 
    await fs.promises.writeFile(filePath, buffer);
    return filePath; 
  }

  async updateMessageContent(id: string, content: string): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id } });

    if (!message) {
      throw new NotFoundException('Mensagem não encontrada');
    }

    message.content = content;
    return this.messageRepository.save(message);
  }
  
  async findMessageById(id: string): Promise<Message | null> {
    return await this.messageRepository.findOne({ where: { id } });
  }

  async deleteMessage(id: string): Promise<void> {
    const message = await this.messageRepository.findOne({ where: { id } });

    if (!message) {
      throw new NotFoundException('Mensagem não encontrada');
    }

    await this.messageRepository.delete(id);
  }

  async getMessagesBetweenUsers(user1Id: string, user2Id: string): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.senderPF', 'senderPF')
      .leftJoinAndSelect('message.senderPJ', 'senderPJ')
      .leftJoinAndSelect('message.receiverPF', 'receiverPF')
      .leftJoinAndSelect('message.receiverPJ', 'receiverPJ')
      .where(
        `(
          (senderPF.id = :user1Id AND receiverPJ.id = :user2Id) OR
          (senderPJ.id = :user1Id AND receiverPF.id = :user2Id) OR
          (senderPF.id = :user2Id AND receiverPJ.id = :user1Id) OR
          (senderPJ.id = :user2Id AND receiverPF.id = :user1Id) 
        )`,
        { user1Id, user2Id }
      )
      .orderBy('message.sentAt', 'ASC')
      .getMany();
  }  

  async isUserPF(userId: string): Promise<boolean> {
    const user = await this.userPFRepository.findOne({ where: { id: userId } });
    return !!user;
  }
  
  async isUserPJ(userId: string): Promise<boolean> {
    const user = await this.userPJRepository.findOne({ where: { id: userId } });
    return !!user;
  }
  
}
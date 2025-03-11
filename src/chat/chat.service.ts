import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/CreateMessage.dto';
import { UserPF } from '../userpf/userpf.entity';
import { UserPJ } from '../userpj/userpj.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(UserPF)
    private userPFRepository: Repository<UserPF>,
    @InjectRepository(UserPJ)
    private userPJRepository: Repository<UserPJ>,
  ) {}

  async createMessage(dto: CreateMessageDto): Promise<Message> {
    const message = new Message();
    message.content = dto.content;
  
    const senderPF = await this.userPFRepository.findOne({ where: { id: dto.senderId } });
    const senderPJ = await this.userPJRepository.findOne({ where: { id: dto.senderId } });
  
    if (senderPF) {
      message.senderPF = senderPF;
    } else if (senderPJ) {
      message.senderPJ = senderPJ;
    } else {
      throw new Error('Sender not found!');
    }
  
    const receiverPF = await this.userPFRepository.findOne({ where: { id: dto.receiverId } });
    const receiverPJ = await this.userPJRepository.findOne({ where: { id: dto.receiverId } });
  
    if (receiverPF) {
      message.receiverPF = receiverPF;
    } else if (receiverPJ) {
      message.receiverPJ = receiverPJ;
    } else {
      throw new Error('Receiver not found!');
    }
  
    return this.messageRepository.save(message);
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
          (senderPJ.id = :user2Id AND receiverPF.id = :user1Id) OR
          (senderPF.id = :user1Id AND receiverPF.id = :user2Id) OR
          (senderPJ.id = :user1Id AND receiverPJ.id = :user2Id)
        )`,
        { user1Id, user2Id }
      )
      .orderBy('message.sentAt', 'ASC')
      .getMany();
  }  
}
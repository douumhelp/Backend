import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserPF } from '../userpf/userpf.entity';
import { UserPJ } from '../userpj/userpj.entity';

@Entity('chat_message')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => UserPF, { eager: true, nullable: true }) 
  senderPF: UserPF | null;

  @ManyToOne(() => UserPJ, { eager: true, nullable: true }) 
  senderPJ: UserPJ | null;

  @ManyToOne(() => UserPF, { eager: true, nullable: true })
  receiverPF: UserPF | null;

  @ManyToOne(() => UserPJ, { eager: true, nullable: true })
  receiverPJ: UserPJ | null;

  @CreateDateColumn()
  sentAt: Date;
}
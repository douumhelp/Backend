import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserPF } from '../userpf/userpf.entity';
import { UserPJ } from '../userpj/userpj.entity';
import { DateTransformer } from 'src/common/transformers/DateTransformer';

@Entity('chat_message')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  filePath?: string;

  @ManyToOne(() => UserPF, { eager: true, nullable: true }) 
  senderPF: UserPF | null;

  @ManyToOne(() => UserPJ, { eager: true, nullable: true }) 
  senderPJ: UserPJ | null;

  @ManyToOne(() => UserPF, { eager: true, nullable: true })
  receiverPF: UserPF | null;

  @ManyToOne(() => UserPJ, { eager: true, nullable: true })
  receiverPJ: UserPJ | null;

  @CreateDateColumn({ type: 'timestamp', transformer: new DateTransformer() }) 
  sentAt: Date;
}
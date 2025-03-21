import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserPJ } from '../userpj/userpj.entity';

@Entity('scheduling')
export class Scheduling {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startTime: Date;

  @ManyToOne(() => UserPJ, (userPJ) => userPJ.scheduling, { onDelete: 'CASCADE' })
  userPJ: UserPJ;
}

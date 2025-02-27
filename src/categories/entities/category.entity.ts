import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { UserPJ } from '../../userpj/userpj.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => UserPJ, (userPJ) => userPJ.categories)
  userPJs: UserPJ[];
}
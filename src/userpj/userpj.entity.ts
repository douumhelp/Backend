import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

@Entity('user_pj')
export class UserPJ {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  hashPassword: string;

  @Column()
  cnpj: string;

  @Column()
  telephone: string;

  @ManyToMany(() => Category, (category) => category.userPJs)
  @JoinTable({
    name: 'user_pj_categories', 
    joinColumn: {
      name: 'user_pj_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];
} 

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPF } from './userpf.entity'; 
import { RegisterAuthPFDto } from 'src/auth/dto/register-authPF.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserPFService {
  constructor(
    @InjectRepository(UserPF)
    private userPFRepository: Repository<UserPF>,
  ) {}

  async createUserPF(data: RegisterAuthPFDto) {
    console.log('Criando usuário PF com os dados:', data);
  
    const hashedPassword = await bcrypt.hash(data.hashPassword, 10);
    console.log('Senha hasheada para salvar no banco:', hashedPassword);
  
    const userPF = this.userPFRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      hashPassword: hashedPassword,
      cpf: data.cpf,
      telephone: data.telephone,
    });
  
    return this.userPFRepository.save(userPF);
  }
  

  async getUserPF(id: string) {
    return this.userPFRepository.findOne({ where: { id } });
  }

  async getAllUserPF() {
    return this.userPFRepository.find();
  }

  async deleteUserPF(id: string) {
    return this.userPFRepository.delete(id);
  }

  async findByEmail(email: string) {
    return this.userPFRepository.findOne({ where: { email } });
  }

  async findByCpf(cpf: string) {
    return this.userPFRepository.findOne({ where: { cpf } });
  }

  async updateUserPF(id: string, data: any) {
    return this.userPFRepository.update(id, data);
  }
}

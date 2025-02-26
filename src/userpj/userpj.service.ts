import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPJ } from './userpj.entity'; 
import { RegisterAuthPJDto } from 'src/auth/dto/register-authPJ.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserPJService {
  constructor(
    @InjectRepository(UserPJ)
    private userPJRepository: Repository<UserPJ>,
  ) {}

  async createUserPJ(data: RegisterAuthPJDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userPJ = this.userPJRepository.create({
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      hashPassword: hashedPassword,
      cnpj: data.cnpj,
      telephone: data.telephone,
    });

    return this.userPJRepository.save(userPJ);
  }

  async getUserPJ(id: string) {
    return this.userPJRepository.findOne({ where: { id } });
  }

  async getAllUserPJ() {
    return this.userPJRepository.find();
  }

  async deleteUserPJ(id: string) {
    return this.userPJRepository.delete(id);
  }

  async findByEmail(email: string) {
    return this.userPJRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string) {
    return this.userPJRepository.findOne({ where: { username } });
  }

  async findByCnpj(cnpj: string) {
    return this.userPJRepository.findOne({ where: { cnpj } });
  }

  async updateUserPJ(id: string, data: any) {
    return this.userPJRepository.update(id, data);
  }
}

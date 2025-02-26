import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserPFService } from '../userpf/userpf.service';
import { UserPJService } from '../userpj/userpj.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcryptjs';
import { RegisterAuthPFDto } from './dto/register-authPF.dto';
import { RegisterAuthPJDto } from './dto/register-authPJ.dto';
import { JwtService } from '@nestjs/jwt';
import { UserPF } from '../userpf/userpf.entity'; 

@Injectable()
export class AuthService {
  constructor(
    private readonly userPFService: UserPFService,
    private readonly userPJService: UserPJService,
    private readonly jwtService: JwtService,
  ) {}

  async registerPF(dto: RegisterAuthPFDto) {
    const userExists = await this.userPFService.findByEmail(dto.email);
    if (userExists) {
      throw new ConflictException('E-mail já cadastrado!');
    }

    const hashedPassword = await bcrypt.hash(dto.hashPassword, 10);
    const user = await this.userPFService.createUserPF({
      ...dto,
      hashPassword: hashedPassword,
    });

    return { message: 'Cadastro realizado com sucesso!', user };
  }

  async registerPJ(dto: RegisterAuthPJDto) {
    const userExists = await this.userPJService.findByEmail(dto.email);
    if (userExists) {
      throw new ConflictException('E-mail já cadastrado!');
    }

    const hashedPassword = await bcrypt.hash(dto.hashPassword, 10);
    const user = await this.userPJService.createUserPJ({
      ...dto,
      hashPassword: hashedPassword,
    });

    return { message: 'Cadastro realizado com sucesso!', user };
  }

  async login(dto: LoginAuthDto) {
    const { username, email, cpf, cnpj, hashPassword } = dto;
    let user;
    let role;

    if (email) {
      user = await this.userPFService.findByEmail(email) || await this.userPJService.findByEmail(email);
      role = user instanceof UserPF ? 'pf' : 'pj';
    } else if (username) {
      user = await this.userPFService.findByUsername(username) || await this.userPJService.findByUsername(username);
      role = user instanceof UserPF ? 'pf' : 'pj';
    } else if (cpf) {
      user = await this.userPFService.findByCpf(cpf.replace(/\D/g, ''));
      role = 'pf';
    } else if (cnpj) {
      user = await this.userPJService.findByCnpj(cnpj.replace(/\D/g, ''));
      role = 'pj';
    }

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado!');
    }

    const passwordValid = await bcrypt.compare(hashPassword, user.hashPassword); 
    if (!passwordValid) {
      throw new UnauthorizedException('Senha incorreta!');
    }

    const payload = { sub: user.id, role: role };
    const token = this.jwtService.sign(payload, {
      secret: "XU2U9Fxq7QdfXG+uL5yPz4DkMvZQkXr8Ml79pWQcM1os2dNw/txEaDp2k6iG9+uh",  
      expiresIn: '60m',
    });

    return { message: 'Login realizado com sucesso!', token };
  }
}

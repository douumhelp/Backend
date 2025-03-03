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
    console.log('DTO recebido para registro:', dto);
    console.log('Senha recebida para hash:', dto.hashPassword);
  
    const userExists = await this.userPFService.findByEmail(dto.email);
    if (userExists) {
      throw new ConflictException('E-mail já cadastrado!');
    }
  
    console.log('Usuário não encontrado, continuando com registro.');
  
    const user = await this.userPFService.createUserPF(dto);

    console.log('Usuário cadastrado com sucesso:', user);
    return { message: 'Cadastro realizado com sucesso!', user };
  }
  

  async registerPJ(dto: RegisterAuthPJDto) {
    const userExists = await this.userPJService.findByEmail(dto.email);
    if (userExists) {
      throw new ConflictException('E-mail já cadastrado!');
    }

    const user = await this.userPJService.createUserPJ(dto);

    return { message: 'Cadastro realizado com sucesso!', user };
  }

  async login(dto: LoginAuthDto) {
    const { email, cpf, cnpj, hashPassword } = dto;
    let user;
    let role;

    if (email) {
      user = await this.userPFService.findByEmail(email) || await this.userPJService.findByEmail(email);
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

    const passwordValid = await bcrypt.compare(dto.hashPassword, user.hashPassword);
    console.log('Senha digitada:', dto.hashPassword);
    console.log('Senha armazenada:', user.hashPassword);
    console.log('Senha válida?', passwordValid);
    
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

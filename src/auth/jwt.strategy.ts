import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface'; 
import { UserPFService } from '../userpf/userpf.service';
import { UserPJService } from '../userpj/userpj.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userPFService: UserPFService,
    private readonly userPJService: UserPJService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "XU2U9Fxq7QdfXG+uL5yPz4DkMvZQkXr8Ml79pWQcM1os2dNw/txEaDp2k6iG9+uh", 
    });
  }

  async validate(payload: JwtPayload) {
    let user;
    if (payload.role === 'pf') {
      user = await this.userPFService.getUserPF(payload.sub);
    } else if (payload.role === 'pj') {
      user = await this.userPJService.getUserPJ(payload.sub);
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return { ...user, isPJ: payload.role === 'pj' };
  }
}

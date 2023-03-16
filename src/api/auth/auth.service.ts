import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { User } from '../users/users.entity';
import { IAuthUser } from '../../interfaces/index';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneEmail(email);

    if (user && this.checkHash(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(payload: { email: string; id: number }): Promise<IAuthUser> {
    let user = await this.usersService.findOneEmail(payload.email);

    delete user.password;
    user.roles.forEach((role) => delete role.id);

    return {
      user: user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: CreateUserDto): Promise<IAuthUser> {
    const userExist = await this.usersService.findOneEmail(user.email);

    if (userExist) {
      throw new HttpException(
        'A user with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const newUser: User = await this.usersService.create({
        ...user,
        password: this.hashPassword(user.password),
      });

      const payload = { email: newUser.email, id: newUser.id };
      return {
        user: newUser,
        access_token: this.jwtService.sign(payload),
      };
    }
  }

  hashPassword = (password: string): string => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    return hash;
  };

  checkHash = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
  };
}

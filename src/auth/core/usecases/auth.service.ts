import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { UserRepositoryInterface } from './user-repository.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) { }

  async register(username: string, email: string, password?: string): Promise<User> {
    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) throw new ConflictException('Email already registered');

    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) throw new ConflictException('Username already taken');

    let password_hash: string | null = null;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    return this.userRepository.create({
      username,
      email,
      password_hash,
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (user && user.password_hash) {
      const isMatch = await bcrypt.compare(pass, user.password_hash);
      if (isMatch) {
        const { password_hash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async googleLogin(googleToken: string) {
    return { message: 'Google login logic goes here' };
  }
}

import { Injectable, Inject } from '@nestjs/common';
import type { UserRepositoryInterface } from './user-repository.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async searchUsers(query: string, excludeUserId?: string): Promise<Partial<User>[]> {
    let users = await this.userRepository.search(query);
    
    if (excludeUserId) {
      users = users.filter(user => user.id !== excludeUserId);
    }

    // Remove sensitive information
    return users.map(user => {
      const { password_hash, ...result } = user;
      return result;
    });
  }

  async getAllUsers(excludeUserId?: string): Promise<Partial<User>[]> {
    let users = await this.userRepository.findAll();

    if (excludeUserId) {
      users = users.filter(user => user.id !== excludeUserId);
    }

    return users.map(user => {
      const { password_hash, ...result } = user;
      return result;
    });
  }

  async findById(id: string): Promise<Partial<User> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    const { password_hash, ...result } = user;
    return result;
  }

  async updateProfile(id: string, updateData: { username?: string; bio?: string; avatar_url?: string }): Promise<Partial<User> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    if (updateData.username) user.username = updateData.username;
    if (updateData.bio !== undefined) user.bio = updateData.bio;
    if (updateData.avatar_url) user.avatar_url = updateData.avatar_url;

    const updatedUser = await this.userRepository.save(user);
    const { password_hash, ...result } = updatedUser;
    return result;
  }
}

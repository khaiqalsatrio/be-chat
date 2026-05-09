import { User } from '../entities/user.entity';

export interface UserRepositoryInterface {
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  search(query: string): Promise<User[]>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  save(user: User): Promise<User>;
}

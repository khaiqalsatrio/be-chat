import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password_hash: string | null;

  @Column({ nullable: true, unique: true })
  google_id: string | null;

  @Column({ nullable: true })
  avatar_url: string | null;

  @Column({ default: 'OFFLINE' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  last_seen: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

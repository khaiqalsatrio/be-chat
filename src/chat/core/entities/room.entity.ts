import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { RoomParticipant } from './room-participant.entity';
import { Message } from './message.entity';

export enum RoomType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.DIRECT,
  })
  type: RoomType;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => RoomParticipant, (participant) => participant.room)
  participants: RoomParticipant[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}

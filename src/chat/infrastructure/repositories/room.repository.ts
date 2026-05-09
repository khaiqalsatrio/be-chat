import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../core/entities/room.entity';
import { RoomParticipant } from '../../core/entities/room-participant.entity';
import { RoomRepositoryInterface } from '../../core/usecases/room-repository.interface';

@Injectable()
export class RoomRepository implements RoomRepositoryInterface {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(RoomParticipant)
    private readonly participantRepo: Repository<RoomParticipant>,
  ) {}

  async findById(id: string): Promise<Room | null> {
    return this.roomRepo.findOne({
      where: { id },
      relations: ['participants', 'participants.user'],
    });
  }

  async findUserRooms(userId: string): Promise<Room[]> {
    return this.roomRepo
      .createQueryBuilder('room')
      .innerJoin('room.participants', 'participant')
      .where('participant.user_id = :userId', { userId })
      .leftJoinAndSelect('room.participants', 'all_participants')
      .leftJoinAndSelect('all_participants.user', 'user')
      .orderBy('room.created_at', 'DESC')
      .getMany();
  }

  async createRoom(roomData: Partial<Room>): Promise<Room> {
    const room = this.roomRepo.create(roomData);
    return this.roomRepo.save(room);
  }

  async addParticipant(participantData: Partial<RoomParticipant>): Promise<RoomParticipant> {
    const participant = this.participantRepo.create(participantData);
    return this.participantRepo.save(participant);
  }

  async findParticipant(roomId: string, userId: string): Promise<RoomParticipant | null> {
    return this.participantRepo.findOne({
      where: { room_id: roomId, user_id: userId },
    });
  }
}

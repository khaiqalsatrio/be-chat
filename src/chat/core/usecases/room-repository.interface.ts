import { Room } from '../entities/room.entity';
import { RoomParticipant } from '../entities/room-participant.entity';

export interface RoomRepositoryInterface {
  findById(id: string): Promise<Room | null>;
  findUserRooms(userId: string): Promise<Room[]>;
  createRoom(room: Partial<Room>): Promise<Room>;
  addParticipant(participant: Partial<RoomParticipant>): Promise<RoomParticipant>;
  findParticipant(roomId: string, userId: string): Promise<RoomParticipant | null>;
}

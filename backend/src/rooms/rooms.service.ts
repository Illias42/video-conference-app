import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { v4 as uuidv4 } from "uuid";
import { CreateDto, GetMessagesDto, SearchDto } from "./dto";

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async createRoom(dto: CreateDto) {
    const id = uuidv4();
    const room = await this.prisma.room.create({
      data: {
        name: dto.name,
        socketId: id
      }
    });
    return room;
  }


  async getAllRooms() {
    const rooms = await this.prisma.room.findMany({
      select: {
        id: true,
        name: true
      }
    });
    return rooms;
  }

  async search(dto: SearchDto) {
    const rooms = await this.prisma.room.findMany({
      where: {
        name: {
          contains: dto.term
        }
      }
    });
   
    return rooms;
  }

  async getMessages(dto: GetMessagesDto) {
    const messages = await this.prisma.message.findMany({
      where: {
        roomId: dto.id
      },
      select: {
        id: true,
        message: true,
        type: true,
        userId: true,
        createdAt: true
      }
    });

    const messagesWithUser = await Promise.all(messages.map(async (message) => {
      const user = await this.prisma.user.findUnique({
        where: {
          id: message.userId
        },
        select: {
          name: true,
          avatar: true
        } 
      });

      return {
        ...message,
        userName: user.name,
        avatar: user.avatar
      }
    }))

    console.log(messagesWithUser);
    
    return messagesWithUser;
  }
}
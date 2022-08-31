import { Injectable } from "@nestjs/common";
import { AwsService } from "src/aws/aws.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateDto, SearchDto, GetMessagesDto, GetUserDto } from "./dto";

@Injectable()
export class DirectService {
  constructor(private prisma: PrismaService, private aws: AwsService) {}

  async create(initiatorId: string, dto: CreateDto) {
    const { userId, message } = dto;
    const room = await this.prisma.direct.create({
      data: {
        participantsId: [initiatorId, userId],
      }
    });

    if (message) {
      await this.prisma.message.create({
        data: {
          userId: initiatorId,
          message,
          type: "message",
          directId: room.id
        }
      });
    }

    return room;
  }

  async getRooms(userId: string) {
    const rooms = await this.prisma.direct.findMany({
      where: {
        participantsId: { 
          has: userId
        }
      },
      select: {
        id: true,
        participantsId: true,
        messages: {
          select: {
            message: true,
            createdAt: true
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    const roomsWithUsers = await Promise.all(rooms.map(async (room) => {
      const id = room.participantsId.filter(id => id !== userId)[0];
      const user = await this.prisma.user.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          name: true,
          avatar: true
        }
      });

      return {
        id: room.id,
        userId: user.id,
        lastMessage: {
          text: room.messages[0]?.message,
          createdAt: room.messages[0]?.createdAt
        },
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        }
      }
    }));

    return roomsWithUsers;
  }

  async getRoomMessages(userId: string, dto: GetMessagesDto) {
    try {
      const room = await this.prisma.direct.findMany({
        where: {
          participantsId: {
            hasEvery: [userId, dto.roomId]
          }
        }
      });

      const messages = await this.prisma.message.findMany({
        where: {
          directId: room[0].id
        },
        select: {
          id: true,
          message: true,
          type: true,
          image: true,
          userId: true,
          createdAt: true
        }
      });

      return messages;
    } catch (error) {
      return [];
    }
  }

  async getUser(dto: GetUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.id
      },
      select: {
        id: true,
        name: true,
        avatar: true
      }
    });

    return user;
  }

  async search(userId: string, dto: SearchDto) {
    const directs = await this.prisma.direct.findMany({
      where: {
        participantsId: {
          has: userId
        }
      },
      select: {
        participantsId: true,
      }
    });

    const ids = directs.map(direct => direct.participantsId).flat().filter(id => id !== userId);

    const local = await this.prisma.user.findMany({
      where: {
        id: {
          in: ids
        },
        name: {
          contains: dto.term
        }
      },
      select: {
        id: true,
        name: true,
        avatar: true
      }
    });

    const global = await this.prisma.user.findMany({
      where: {
        id: {
          notIn: ids,
          not: userId
        },
        name: {
          contains: dto.term
        }
      },
      select: {
        id: true,
        name: true,
        avatar: true
      }
    });

    return {
      local,
      global
    };
  }

  async uploadFile(file: any) {
    if (file) {
      const fileLocation = await this.aws.uploadFile(file);
      return fileLocation;
    }
  }
}
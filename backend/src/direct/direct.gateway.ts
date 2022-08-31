import { Body, Logger } from "@nestjs/common";
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { DirectService } from "./direct.service";
import { JoinDto, LeaveDto, SendMessageDto } from "./dto";

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class DirectGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger();

  constructor (private directService: DirectService, private prisma: PrismaService) {}

  @SubscribeMessage("joinDirect")
  async join(
    @ConnectedSocket() socket: any,
    @Body() dto: JoinDto,
  ): Promise<void> {
    const { userId, roomId } = dto;
    let room = await this.getRoomId([roomId, userId]);

    if (!room) {
      room = await this.directService.create(userId, {userId: roomId, message: null});
    }

    socket.join(room.id);
  }

  @SubscribeMessage("leave")
  async leave(
    @ConnectedSocket() socket: any,
    @Body() dto: LeaveDto
  ): Promise<void> {
    const { roomId } = dto;
    socket.leave(roomId)
  }

  @SubscribeMessage("sendDirectMessage")
  async sendMessage(
    @Body() dto: SendMessageDto
  ): Promise<boolean> {
    let room = await this.getRoomId([dto.sendeeId, dto.senderId]);

    if (!room) {
      room = await this.directService.create(dto.senderId, {userId: dto.sendeeId, message: dto.message});
    }

    const message = await this.prisma.message.create({
      data: {
        userId: dto.senderId,
        type: dto.image ? "image" : "text",
        image: dto.image ?? null,
        message: dto.message,
        directId: room.id
      } 
    });

    await this.prisma.direct.update({
      where: {
        id: room.id
      },
      data: {
        updatedAt: new Date()
      }
    });

    this.server.to(room.id).emit("receiveDirectMessage", message);

    if (message) {
      return true;
    }
  }

  async getRoomId(participantsId: string[]): Promise<any> {
    if (participantsId.length !== 2) {
      throw new Error("Invalid participantsId");
    }
    const room = await this.prisma.direct.findMany({
      where: {
        participantsId: {
          hasEvery: participantsId
        }
      }
    });

    return room[0];
  }
}
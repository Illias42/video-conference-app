import { Server } from 'socket.io';
import { RoomsService } from './rooms.service';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Message } from './types';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  JoinDto,
  LeaveDto,
  RelaySDPDto,
  RelayICEDto,
  SendMessageDto,
} from './dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger();

  private activeSockets: { room: string; id: string; user: string }[] = [];

  constructor(
    private roomsService: RoomsService,
    private prisma: PrismaService,
  ) {}

  @SubscribeMessage('message')
  findAll(@MessageBody() data: any): void {
    this.server.emit('resp', data);
  }

  @SubscribeMessage('getRooms')
  getRooms(@ConnectedSocket() socket: any): void {
    this.server.emit('rooms', socket.rooms);
  }

  @SubscribeMessage('getAllRooms')
  async getAllRooms(@ConnectedSocket() socket: any): Promise<void> {
    const rooms = await this.roomsService.getAllRooms();
    socket.emit('allRooms', rooms);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() socket: any,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.userId,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });

    const newMessage = await this.prisma.message.create({
      data: {
        userId: user.id,
        roomId: dto.roomId,
        type: dto.type,
        message: dto.message,
      },
    });

    const responseMessage: Message = {
      type: dto.type,
      message: dto.message,
      createdAt: newMessage.createdAt,
    };

    if (dto.type === 'message') {
      responseMessage.userId = user.id;
      responseMessage.userName = user.name;
      responseMessage.avatar = user.avatar;
    }

    this.server.to(dto.roomId).emit('receiveMessage', responseMessage);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() dto: JoinDto,
    @ConnectedSocket() socket: any,
  ): Promise<void> {
    const { roomId, userId } = dto;
    if (
      userId &&
      roomId &&
      !this.activeSockets.find((s) => s.room === roomId && s.id === socket.id)
    ) {
      this.logger.log(
        'Joining room: ' +
          roomId +
          ' with user: ' +
          userId +
          ' and socket: ' +
          socket.id,
      );
      this.activeSockets = [
        ...this.activeSockets,
        { id: socket.id, room: roomId, user: userId },
      ];

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          name: true,
          avatar: true,
        },
      });

      this.activeSockets
        .filter((socket) => socket.room === roomId)
        .forEach(async (participant) => {
          socket.to(participant.id).emit('addPeer', {
            client: {
              peerID: socket.id,
              name: user.name,
              avatar: '',
            },
            createOffer: true,
          });

          const participantData = await this.prisma.user.findUnique({
            where: {
              id: participant.user,
            },
            select: {
              name: true,
              avatar: true,
            },
          });

          socket.emit('addPeer', {
            client: {
              peerID: participant.id,
              name: participantData.name,
              avatar: '',
            },
            createOffer: false,
          });
        });

      socket.join(roomId);

      const joinMessage = await this.prisma.message.create({
        data: {
          userId,
          roomId: roomId,
          type: 'notification',
          message: `${user.name} joined room`,
        },
      });

      this.server.to(roomId).emit('receiveMessage', joinMessage);

      this.getParticipants(roomId);
    }
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() dto: LeaveDto,
    @ConnectedSocket() socket: any,
  ): Promise<void> {
    const { roomId, userId } = dto;
    if (
      userId &&
      roomId &&
      this.activeSockets.find((s) => s.room === roomId && s.id === socket.id)
    ) {
      this.logger.log(
        'Leaving room: ' +
          roomId +
          ' with user: ' +
          userId +
          ' and socket: ' +
          socket.id,
      );

      this.activeSockets = this.activeSockets.filter(
        (s) => s.room !== roomId || s.id !== socket.id || s.user !== userId,
      );

      this.activeSockets
        .filter((socket) => socket.room === roomId)
        .forEach((participant) => {
          socket.to(participant.id).emit('removePeer', {
            peerID: socket.id,
          });
        });

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          name: true,
        },
      });

      const leaveMessage = await this.prisma.message.create({
        data: {
          userId,
          roomId: roomId,
          type: 'notification',
          message: `${user.name} left room`,
        },
      });

      this.server.to(roomId).emit('receiveMessage', leaveMessage);

      socket.leave(roomId);
      this.getParticipants(roomId);
    }
  }

  @SubscribeMessage('relaySDP')
  async relaySDP(
    @MessageBody() dto: RelaySDPDto,
    @ConnectedSocket() socket: any,
  ) {
    this.server.to(dto.peerID).emit('sdp', {
      peerID: socket.id,
      sessionDescription: dto.sessionDescription,
    });
  }

  @SubscribeMessage('relayICE')
  async relayICE(
    @MessageBody() dto: RelayICEDto,
    @ConnectedSocket() socket: any,
  ) {
    this.server.to(dto.peerID).emit('ice', {
      peerID: socket.id,
      iceCandidate: dto.iceCandidate,
    });
  }

  async getParticipants(roomId: string): Promise<void> {
    const sockets = this.activeSockets.filter((s) => s.room === roomId);
    const ids = sockets.map((s) => s.user);
    const participants = await this.prisma.user.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        avatar: true,
        name: true,
        email: true,
      },
    });
    this.server.to(roomId).emit('participants', participants);
  }
}

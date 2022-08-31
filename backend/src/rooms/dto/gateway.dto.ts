import { IsNotEmpty, IsString } from "class-validator";
import { MessageType } from "../types";

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  type: MessageType;
  
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}

export class JoinDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class LeaveDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class RelaySDPDto {
  @IsNotEmpty()
  @IsString()
  peerID: string;

  @IsNotEmpty()
  sessionDescription: any;
}

export class RelayICEDto {
  @IsNotEmpty()
  @IsString()
  peerID: string;

  @IsNotEmpty()
  iceCandidate: any;
}
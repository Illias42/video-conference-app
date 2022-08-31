import { IsNotEmpty, IsString } from "class-validator";

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
}

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  sendeeId: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
import { IsNotEmpty, IsString } from "class-validator";

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsString()
  message: string;
}

export class GetMessagesDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;
}

export class SearchDto {
  @IsString()
  term: string;
}

export class GetUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
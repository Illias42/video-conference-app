import { IsNotEmpty, IsString } from "class-validator";

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class SearchDto {
  @IsNotEmpty()
  @IsString()
  term: string;
}

export class GetMessagesDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
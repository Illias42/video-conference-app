import { Controller, Get, Post, HttpCode, HttpStatus, Body, Param, Query, UseGuards } from "@nestjs/common";
import { AtGuard } from "src/guards";
import { CreateDto, GetMessagesDto, SearchDto } from "./dto";
import { RoomsService } from "./rooms.service";

@UseGuards(AtGuard)
@Controller('rooms')
export class RoomsController { 
  constructor(private roomsService: RoomsService) {}

  @Post('/')
  async createRoom(@Body() dto: CreateDto) {
    return this.roomsService.createRoom(dto);
  }

  @Get('/')
  async getAllRooms() {
    return this.roomsService.getAllRooms();
  }

  @Get('/search')
  async search(@Query() dto: SearchDto) {
    return this.roomsService.search(dto);
  }

  @Get('/:id/messages')
  async getMessages(@Param() dto: GetMessagesDto) {
    return this.roomsService.getMessages(dto);
  }
}
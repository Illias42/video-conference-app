import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetCurrentUserId, Public } from "src/decorators";
import { AtGuard } from "src/guards";
import { DirectService } from "./direct.service";
import { CreateDto, SearchDto, GetMessagesDto, GetUserDto } from "./dto";

@UseGuards(AtGuard)
@Controller('direct')
export class DirectController {
  constructor(private directService: DirectService) {}

  @Post("/create")
  async createRoom(
    @GetCurrentUserId() initiatorId: string,
    @Body() dto: CreateDto,
  ) {
    return this.directService.create(initiatorId, dto);
  }

  @Get('/')
  async getRooms(
    @GetCurrentUserId() id: string
  ) {
    return this.directService.getRooms(id);
  }

  @Get('/messages/:roomId')
  async getRoomMessages(
    @GetCurrentUserId() userId: string,
    @Param() dto: GetMessagesDto,
  ) {
    return this.directService.getRoomMessages(userId, dto);
  }

  @Get('/search')
  async search(
    @GetCurrentUserId() userId: string,
    @Query() dto: SearchDto
  ) {
    return this.directService.search(userId, dto);
  }

  @Get('/user/:id')
  async getUser(
    @Param() dto: GetUserDto
  ) {
    return this.directService.getUser(dto);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any
  ) {
    return this.directService.uploadFile(file);
  }
}
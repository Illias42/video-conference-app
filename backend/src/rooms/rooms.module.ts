import { Module } from "@nestjs/common";
import { RoomsController } from "./rooms.controller";
import { RoomsGateway } from "./rooms.gateway";
import { RoomsService } from "./rooms.service";

@Module({
  providers: [RoomsGateway, RoomsService],
  controllers: [RoomsController]
})
export class RoomsModule {}
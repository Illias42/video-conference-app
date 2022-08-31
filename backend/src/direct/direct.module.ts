import { Module } from "@nestjs/common";
import { DirectController } from "./direct.controller";
import { DirectGateway } from "./direct.gateway";
import { DirectService } from "./direct.service";

@Module({
  providers: [DirectGateway, DirectService],
  controllers: [DirectController]
})
export class DirectModule {}
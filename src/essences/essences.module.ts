import { Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import {EssencesService} from "./essences.service";
import {EssencesController} from "./essences.controller";

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  providers: [EssencesService],
  controllers: [EssencesController],
})
export class EssencesModule {}
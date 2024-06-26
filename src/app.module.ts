import { Module} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';
import { EssencesModule } from './essences/essences.module';
import { CacheModule } from "@nestjs/cache-manager";
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 1800,
      max: 100,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 5,
    }),
    HttpModule,
    EssencesModule,
      AuthModule,
  ],
})
export class AppModule {}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {ThrottlerExceptionFilter} from "./common/filters/throttler-exception.filter";
import {setupSwagger} from "./config/swagger.config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalFilters(new ThrottlerExceptionFilter());

    setupSwagger(app);

    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
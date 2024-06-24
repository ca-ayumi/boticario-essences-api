import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import {ThrottlerExceptionFilter} from "./common/filters/throttler-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // // Usar Helmet para segurança básica
    // app.use(helmet());
    //
    // // Configuração de rate limiting para segurança adicional
    // app.use(rateLimit({
    //     windowMs: 60 * 1000, // 1 minuto
    //     max: 5, // Limite de 5 requisições por minuto por IP
    // }));

    // Habilitar o CORS
    app.enableCors();

    // Usar ValidationPipe globalmente para validação automática de DTOs
    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalFilters(new ThrottlerExceptionFilter());


    // Configuração do Swagger para documentação da API
    // const options = new DocumentBuilder()
    //     .setTitle('Boticário Essences API')
    //     .setDescription('API para gestão de essências do Grupo Boticário')
    //     .setVersion('1.0')
    //     .addBearerAuth()
    //     .build();
    //
    // const document = SwaggerModule.createDocument(app, options);
    // SwaggerModule.setup('api', app, document);

    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
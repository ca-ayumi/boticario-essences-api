import { INestApplication } from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .setTitle('Boticário Essences API')
        .setDescription('API para gestão de essências do Grupo Boticário')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
}

import { ApiProperty } from '@nestjs/swagger';

export class EssenceDetailDto {
    @ApiProperty({ example: 'BSR', description: 'ID da essência' })
    id: string;

    @ApiProperty({ example: 'Buscamos sucesso responsável', description: 'Nome da essência' })
    name: string;

    @ApiProperty({ example: ['VISÃO DE NEGÓCIO', 'RESPONSABILIDADE FINANCEIRA'], description: 'Valores da essência' })
    values: string[];
}

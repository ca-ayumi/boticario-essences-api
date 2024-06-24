import { ApiProperty } from '@nestjs/swagger';

export class EssenceListDto {
    @ApiProperty({ example: 'FEONCB', description: 'ID da essência' })
    id: string;

    @ApiProperty({ example: 'Fazemos os olhos dos nossos clientes brilharem', description: 'Nome da essência' })
    name: string;
}

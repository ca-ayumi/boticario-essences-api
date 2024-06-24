import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token de acesso JWT' })
    access_token: string;

    @ApiProperty({ example: 3600, description: 'Tempo de vida do token em segundos' })
    expires_in: number;

    @ApiProperty({ example: 'Bearer', description: 'Tipo de token' })
    token_type: string;
}

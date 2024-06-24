import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'username', description: 'Nome de usuário' })
    username: string;

    @ApiProperty({ example: 'password', description: 'Senha do usuário' })
    password: string;
}

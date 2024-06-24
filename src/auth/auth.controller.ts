import {Controller, Post, Body, HttpStatus, HttpCode} from '@nestjs/common';
import { AuthService } from './auth.service';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthResponseDto} from "./dto/auth-response.dto";
import {LoginDto} from "./dto/login.dto";
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Autenticar usuário' })
    @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso.', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
    async login(@Body() user: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(user);
    }
}

import {Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const envUsername = this.configService.get<string>('API_USER');
        const envPassword = this.configService.get<string>('API_PASSWORD');

        if (username === envUsername && password === envPassword) {
            return { username };
        }
        return null;
    }

    async generateToken(user: any) {
        const payload = { username: user.username, sub: user.userId };
        const accessToken = this.jwtService.sign(payload);
        return {
            access_token: accessToken,
            expires_in: 3600,
            token_type: 'Bearer',
        };
    }

    async login(user: any) {
        const validatedUser = await this.validateUser(user.username, user.password);
        if (!validatedUser) {
            throw new UnauthorizedException();
        }
        return this.generateToken(validatedUser);
    }
}

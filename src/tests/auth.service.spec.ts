import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import {AuthService} from "../auth/auth.service";

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token'),
            decode: jest.fn().mockReturnValue({ username: 'test', sub: 1 }),
          },
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user with correct credentials', async () => {
    const user = await service.validateUser(process.env.API_USER, process.env.API_PASSWORD);
    expect(user).toEqual({ username: process.env.API_USER });
  });

  it('should return null for invalid credentials', async () => {
    const user = await service.validateUser('invalid', 'invalid');
    expect(user).toBeNull();
  });

  it('should generate token with correct payload', async () => {
    const user = { username: 'test', userId: 1 };
    const token = await service.generateToken(user);

    expect(token).toHaveProperty('access_token');
    expect(token).toHaveProperty('expires_in', 3600);
    expect(token).toHaveProperty('token_type', 'Bearer');

    const decodedToken = jwtService.decode(token.access_token) as any;
    expect(decodedToken.username).toBe(user.username);
    expect(decodedToken.sub).toBe(user.userId);
  });

  it('should throw UnauthorizedException for invalid login', async () => {
    await expect(service.login({ username: 'invalid', password: 'invalid' })).rejects.toThrow(UnauthorizedException);
  });
});

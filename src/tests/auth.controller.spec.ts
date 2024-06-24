import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import {AuthService} from "../auth/auth.service";
import {AuthController} from "../auth/auth.controller";

dotenv.config({ path: '.env.test' });

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn((user) => {
              if (user.username === process.env.API_USER && user.password === process.env.API_PASSWORD) {
                return {
                  access_token: 'valid_token',
                  expires_in: 3600,
                  token_type: 'Bearer',
                };
              }
              throw new UnauthorizedException();
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a token for valid credentials', async () => {
    const result = await controller.login({
      username: process.env.API_USER,
      password: process.env.API_PASSWORD,
    });
    expect(result).toEqual({
      access_token: 'valid_token',
      expires_in: 3600,
      token_type: 'Bearer',
    });
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    await expect(controller.login({
      username: 'invalid',
      password: 'invalid',
    })).rejects.toThrow(UnauthorizedException);
  });
});

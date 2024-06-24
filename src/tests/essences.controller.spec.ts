import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {EssencesController} from "../essences/essences.controller";
import {EssencesService} from "../essences/essences.service";

describe('EssencesController', () => {
  let controller: EssencesController;
  let service: EssencesService;

  const mockEssencesService = {
    getEssences: jest.fn(() => [{ id: '1', name: 'Essence 1' }]),
    getEssenceDetail: jest.fn((id: string) => ({ id, name: `Essence ${id}`, values: ['Value1', 'Value2'] })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EssencesController],
      providers: [
        {
          provide: EssencesService,
          useValue: mockEssencesService,
        },
      ],
    })
        .overrideGuard(ThrottlerGuard)
        .useValue({ canActivate: jest.fn(() => true) })
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: jest.fn(() => true) })
        .compile();

    controller = module.get<EssencesController>(EssencesController);
    service = module.get<EssencesService>(EssencesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEssences', () => {
    it('should return an array of essences', async () => {
      const result = await controller.getEssences();
      expect(result).toEqual([{ id: '1', name: 'Essence 1' }]);
      expect(service.getEssences).toHaveBeenCalled();
    });
  });

  describe('getEssenceDetail', () => {
    it('should return the details of an essence', async () => {
      const result = await controller.getEssenceDetail('1');
      expect(result).toEqual({ id: '1', name: 'Essence 1', values: ['Value1', 'Value2'] });
      expect(service.getEssenceDetail).toHaveBeenCalledWith('1');
    });
  });
});

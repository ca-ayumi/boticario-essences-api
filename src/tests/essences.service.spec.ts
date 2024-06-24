import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpException } from '@nestjs/common';
import { EssencesService } from "../essences/essences.service";

describe('EssencesService', () => {
    let service: EssencesService;
    let httpService: HttpService;
    let cacheManager: Cache;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EssencesService,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            switch (key) {
                                case 'API_URL':
                                    return 'https://api.dev.grupoboticario.com.br/v1/essences-challenge';
                                case 'API_USER':
                                    return 'user';
                                case 'API_PASSWORD':
                                    return 'password';
                                default:
                                    return null;
                            }
                        }),
                    },
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<EssencesService>(EssencesService);
        httpService = module.get<HttpService>(HttpService);
        cacheManager = module.get<Cache>(CACHE_MANAGER);
    });

    describe('getEssences', () => {
        it('should return cached data if available', async () => {
            const cachedData = [{ id: '1', name: 'Essence 1' }];
            jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(cachedData);

            const result = await service.getEssences();
            expect(result).toEqual(cachedData);
            expect(cacheManager.get).toHaveBeenCalledWith('essences-list');
        });

        it('should fetch data from API if not cached', async () => {
            const apiData: AxiosResponse = {
                data: [{ id: '1', name: 'Essence 1' }],
                status: 200,
                statusText: 'OK',
                headers: { 'Content-Type': 'application/json' },
                config: { headers: { 'Content-Type': 'application/json' } },
            };
            jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
            jest.spyOn(httpService, 'get').mockReturnValueOnce(of(apiData));
            jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(undefined);

            const result = await service.getEssences();
            expect(result).toEqual(apiData.data);
            expect(httpService.get).toHaveBeenCalledWith('https://api.dev.grupoboticario.com.br/v1/essences-challenge/essences', {
                headers: { Authorization: 'Basic dXNlcjpwYXNzd29yZA==' },
            });
            expect(cacheManager.set).toHaveBeenCalledWith('essences-list', apiData.data, { ttl: 1800 });
        });

        it('should throw an HttpException if API call fails', async () => {
            jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
            jest.spyOn(httpService, 'get').mockReturnValueOnce(
                throwError(() => new HttpException('Erro ao buscar dados da API', 502)),
            );

            await expect(service.getEssences()).rejects.toThrow(HttpException);
        });
    });

    describe('getEssenceDetail', () => {
        it('should return cached data if available', async () => {
            const cachedData = { id: '1', name: 'Essence 1', values: ['Value1', 'Value2'] };
            jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(cachedData);

            const result = await service.getEssenceDetail('1');
            expect(result).toEqual(cachedData);
            expect(cacheManager.get).toHaveBeenCalledWith('essence-detail-1');
        });

        it('should fetch data from API if not cached', async () => {
            const apiData: AxiosResponse = {
                data: { id: '1', name: 'Essence 1', values: ['Value1', 'Value2'] },
                status: 200,
                statusText: 'OK',
                headers: { 'Content-Type': 'application/json' },
                config: { headers: { 'Content-Type': 'application/json' } },
            };
            jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
            jest.spyOn(httpService, 'get').mockReturnValueOnce(of(apiData));
            jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(undefined);

            const result = await service.getEssenceDetail('1');
            expect(result).toEqual(apiData.data);
            expect(httpService.get).toHaveBeenCalledWith('https://api.dev.grupoboticario.com.br/v1/essences-challenge/essences/1', {
                headers: { Authorization: 'Basic dXNlcjpwYXNzd29yZA==' },
            });
            expect(cacheManager.set).toHaveBeenCalledWith('essence-detail-1', apiData.data, { ttl: 1800 });
        });

        it('should throw an HttpException if API call fails', async () => {
            jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
            jest.spyOn(httpService, 'get').mockReturnValueOnce(
                throwError(() => new HttpException('Erro ao buscar detalhes da API', 502)),
            );

            await expect(service.getEssenceDetail('1')).rejects.toThrow(HttpException);
        });
    });
});
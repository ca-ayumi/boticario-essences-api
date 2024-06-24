import { Injectable, Inject, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Buffer } from 'buffer';

@Injectable()
export class EssencesService {
    private readonly API_URL: string;
    private readonly API_AUTH: string;
    private readonly logger = new Logger(EssencesService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {
        this.API_URL = this.configService.get<string>('API_URL');
        const apiUser = this.configService.get<string>('API_USER');
        const apiPassword = this.configService.get<string>('API_PASSWORD');
        this.API_AUTH = 'Basic ' + Buffer.from(`${apiUser}:${apiPassword}`).toString('base64');
    }

    async getEssences() {
        const cacheKey = 'essences-list';
        this.logger.log(`Buscando dados do cache com a chave ${cacheKey}`);
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
            this.logger.log('Dados encontrados no cache');
            return cachedData;
        }
        this.logger.log('Dados não encontrados no cache, fazendo nova solicitação à API');
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.API_URL}/essences`, {
                    headers: { Authorization: this.API_AUTH },
                }).pipe(
                    catchError(err => {
                        this.logger.error(`Erro ao buscar dados da API: ${err.message}`);
                        throw new HttpException('Erro ao buscar dados da API', HttpStatus.BAD_GATEWAY);
                    }),
                ),
            );
            this.logger.log('Dados recebidos da API, armazenando no cache');
            await this.cacheManager.set(cacheKey, response.data, { ttl: 1800 });
            return response.data;
        } catch (error) {
            this.logger.error(`Erro ao processar solicitação: ${error.message}`);
            throw new HttpException('Erro ao processar solicitação', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getEssenceDetail(id: string) {
        const cacheKey = `essence-detail-${id}`;
        this.logger.log(`Buscando detalhes do cache com a chave ${cacheKey}`);
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
            this.logger.log('Detalhes encontrados no cache');
            return cachedData;
        }
        this.logger.log('Detalhes não encontrados no cache, fazendo nova solicitação à API');
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.API_URL}/essences/${id}`, {
                    headers: { Authorization: this.API_AUTH },
                }).pipe(
                    catchError(err => {
                        if (err.response && err.response.status === 404) {
                            this.logger.error(`Essência com ID ${id} não encontrada`);
                            throw new HttpException('Essência não encontrada', HttpStatus.NOT_FOUND);
                        }
                        this.logger.error(`Erro ao buscar detalhes da API: ${err.message}`);
                        throw new HttpException('Erro ao buscar detalhes da API', HttpStatus.BAD_GATEWAY);
                    }),
                ),
            );
            this.logger.log('Detalhes recebidos da API, armazenando no cache');
            await this.cacheManager.set(cacheKey, response.data, { ttl: 1800 });
            return response.data;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            this.logger.error(`Erro ao processar solicitação: ${error.message}`);
            throw new HttpException('Erro ao processar solicitação', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
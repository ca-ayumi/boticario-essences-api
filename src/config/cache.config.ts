import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
    constructor(private configService: ConfigService) {}

    createCacheOptions(): CacheModuleOptions {
        return {
            ttl: this.configService.get<number>('CACHE_TTL'),
            max: this.configService.get<number>('CACHE_MAX'),
        };
    }
}

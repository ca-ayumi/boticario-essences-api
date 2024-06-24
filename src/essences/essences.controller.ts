import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {EssencesService} from "./essences.service";
import {ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {EssenceDetailDto} from "./dto/essence-detail.dto";
import {EssenceListDto} from "./dto/essence-list.dto";

@ApiTags('essences')
@Controller('essences')
@ApiBearerAuth()
@UseGuards(ThrottlerGuard, JwtAuthGuard)
export class EssencesController {
    constructor(private readonly essencesService: EssencesService) {}

    @Get()
    @Throttle(5, 60)
    @ApiOperation({ summary: 'Obter todas as essências' })
    @ApiResponse({ status: 200, description: 'Lista de essências retornada com sucesso.', type: [EssenceListDto] })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    async getEssences() {
        return this.essencesService.getEssences();
    }

    @Get(':id')
    @Throttle(5, 60)
    @ApiOperation({ summary: 'Obter detalhes de uma essência' })
    @ApiParam({ name: 'id', required: true, description: 'ID da essência' })
    @ApiResponse({ status: 200, description: 'Detalhes da essência retornados com sucesso.', type: EssenceDetailDto })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Essência não encontrada.' })
    async getEssenceDetail(@Param('id') id: string) {
        return this.essencesService.getEssenceDetail(id);
    }
}

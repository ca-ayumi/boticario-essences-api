import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {EssencesService} from "./essences.service";

@Controller('essences')
@UseGuards(ThrottlerGuard, JwtAuthGuard)
export class EssencesController {
    constructor(private readonly essencesService: EssencesService) {}

    @Get()
    @Throttle(5, 60)
    getEssences() {
        return this.essencesService.getEssences();
    }

    @Get(':id')
    @Throttle(5, 60)
    getEssenceDetail(@Param('id') id: string) {
        return this.essencesService.getEssenceDetail(id);
    }
}

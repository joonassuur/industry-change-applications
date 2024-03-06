import { Controller, Get, Delete, Body, Post, Param, Query } from '@nestjs/common';
import { IndustryChangeApplicationsService } from './industry-change-applications.service';
import { CreateIndustryChangeApplicationDto, IndustryChangeApplication } from '../dto/create-industry-change-application.dto';


@Controller('industry-change-applications')
export class IndustryChangeApplicationsController {
    constructor(private readonly industryChangeApplicationsService: IndustryChangeApplicationsService) { }

    @Get()
    async getResidents(): Promise<any[]> {
        try {
            const data = await this.industryChangeApplicationsService.getResidents();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
    @Get()
    async getIndustryChangeApplications(@Query('statuses') statuses: string[], @Query('residentSub') residentSub: string): Promise<IndustryChangeApplication[]> {
        try {
            const data = await this.industryChangeApplicationsService.getIndustryChangeApplications(statuses, residentSub);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    @Get(':id')
    async getIndustryChangeApplication(@Param('id') id: string): Promise<IndustryChangeApplication> {
        try {
            const data = await this.industryChangeApplicationsService.getIndustryChangeApplication(id);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    @Post()
    async createIndustryChangeApplication(@Body() createDto: CreateIndustryChangeApplicationDto): Promise<IndustryChangeApplication> {
        try {
            const data = this.industryChangeApplicationsService.createIndustryChangeApplication(createDto);
            return data;
        } catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    }

    @Delete(':id')
    async deleteIndustryChangeApplication(@Param('id') id: string): Promise<{ message: string }> {
        try {
            return this.industryChangeApplicationsService.deleteIndustryChangeApplication(id);
        } catch (error) {
            console.error('Error deleting data:', error);
            throw error;
        }
    }
}

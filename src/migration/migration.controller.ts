import { Controller, Post } from '@nestjs/common';
import { MigrationService } from './migration.service';

@Controller('migrate-resident-data')
export class MigrationController {
    constructor(private readonly migrationService: MigrationService) { }

    @Post()
    async migrateResidentData(): Promise<{ message: 'OK' }> {
        try {
            const data = this.migrationService.migrateResidentData();
            return data;
        } catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    }

}

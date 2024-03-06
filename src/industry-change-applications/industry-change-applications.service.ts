import { Injectable, BadRequestException } from '@nestjs/common';
import { Client } from 'pg';
import { ApplicationStatus, TypeOfRegistration, ResidentStatus, ObjectStatus } from '../types/types';
import { CreateIndustryChangeApplicationDto, IndustryChangeApplication } from '../dto/create-industry-change-application.dto';


@Injectable()
export class IndustryChangeApplicationsService {
    constructor() { }

    async getResidents(): Promise<any> {
        const client = new Client({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        await client.connect();
        try {
            const query = `SELECT * FROM residents;`;
            const result = await client.query(query);
            if (result.rows.length === 0) {
                throw new BadRequestException('Industry change application not found');
            }
            return result.rows;
        } catch (error) {
            console.error('Error fetching data from database:', error);
            throw error;
        } finally {
            if (client) {
                await client.end();
            }
        }
    }
    async getIndustryChangeApplication(id: string): Promise<IndustryChangeApplication> {
        const client = new Client({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        await client.connect();
        try {
            const query = `SELECT * FROM industryChangeApplications WHERE id = $1 AND objectStatus = $2;`;
            const result = await client.query(query, [id, ObjectStatus.CURRENT]);
            if (result.rows.length === 0) {
                throw new BadRequestException('Industry change application not found');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching data from database:', error);
            throw error;
        } finally {
            if (client) {
                await client.end();
            }
        }
    }


    async getIndustryChangeApplications(statuses: string[], residentSub: string): Promise<IndustryChangeApplication[]> {
        const client = new Client({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        await client.connect();
        try {
            if (!Array.isArray(statuses)) {
                statuses = [statuses];
            }
            if (!residentSub) {
                throw new BadRequestException('Invalid input. statuses must be an array and residentSub must be provided.');
            }
            const residentQuery = `
                SELECT * FROM residents 
                WHERE sub = $1;`;

            const residentResult = await client.query(residentQuery, [residentSub]);
            if (residentResult.rows.length === 0) {
                throw new BadRequestException('Resident not found');
            }

            const applicationsQuery = `
                SELECT * FROM industryChangeApplications WHERE objectStatus = $1
                AND status = ANY($2)
                AND residentSub = $3;`;

            const result = await client.query(applicationsQuery, [ObjectStatus.CURRENT, statuses, residentSub]);
            return result.rows;

        } catch (error) {
            if (error.message.includes('invalid input value for enum status')) {
                throw new BadRequestException('Invalid status value');
            }
            console.error('Error fetching filtered data from database:', error);
            throw error;
        } finally {
            if (client) {
                await client.end();
            }
        }
    }


    async createIndustryChangeApplication(dto: CreateIndustryChangeApplicationDto): Promise<IndustryChangeApplication> {
        const client = new Client({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        await client.connect();

        try {
            const residentsQuery = `
            SELECT * FROM residents WHERE sub = $1
            AND typeOfRegistration IN ($2, $3)
            AND status = $4;
            `;

            const residentsQueryResult = await client.query(residentsQuery, [dto.residentSub, TypeOfRegistration.RESIDENCY, TypeOfRegistration.E_RESIDENCY, ResidentStatus.ACTIVE]);

            if (residentsQueryResult.rows.length === 0) {
                throw new BadRequestException('Resident not found');
            }

            const postQuery = `
            INSERT INTO industryChangeApplications (residentSub, requested, status, objectStatus) 
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `;

            const foundResident = residentsQueryResult.rows.find((item) => Number(item.sub) === Number(dto.residentSub))

            const insertResult = await client.query(postQuery, [dto.residentSub, JSON.stringify({
                willWorkInPhysicalJurisdiction: dto.willWorkInPhysicalJurisdiction
            }), foundResident.willWorkInPhysicalJurisdiction === false ? ApplicationStatus.APPROVED : ApplicationStatus.IN_REVIEW, ObjectStatus.CURRENT]);

            const createdObject = insertResult.rows[0];
            return createdObject;
        } catch (error) {
            console.error('Error creating industry change application:', error);
            throw error;
        }
        finally {
            if (client) {
                await client.end();
            }
        }
    }

    async deleteIndustryChangeApplication(id: string): Promise<{ message: string }> {
        const client = new Client({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        await client.connect();

        try {
            const query = `SELECT * FROM industryChangeApplications WHERE id = $1 AND status = $2 AND objectStatus = $3;`;
            const result = await client.query(query, [id, ApplicationStatus.IN_REVIEW, ObjectStatus.CURRENT]);

            if (result.rowCount === 0) {
                throw new BadRequestException('Industry change application not found');
            }

            const updateQuery = `UPDATE industryChangeApplications SET objectStatus = $1 WHERE id = $2;`;
            await client.query(updateQuery, [ObjectStatus.DELETED, id]);
            return { message: 'OK' };
        } catch (error) {
            console.error('Error deleting industry change application:', error);
            throw error;
        } finally {
            await client.end();
        }
    }
}

import { Injectable } from '@nestjs/common';
import { TypeOfRegistration, ResidentStatus } from '../types/types';
import { Client } from 'pg';

@Injectable()
export class MigrationService {

  constructor() { }

  async checkEnumTypeExists(client: Client, enumName: string): Promise<boolean> {
    const result = await client.query(
      `SELECT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = $1
      );`,
      [enumName]
    );
    return result.rows[0].exists;
  }

  async migrateResidentData(): Promise<{ message: 'OK' }> {
    const client = new Client({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await client.connect();
    try {
      const registrationTypeExists = await this.checkEnumTypeExists(client, 'registration');
      const statusTypeExists = await this.checkEnumTypeExists(client, 'status');

      if (!registrationTypeExists) {
        await client.query(`
        CREATE TYPE registration AS ENUM (
          '${TypeOfRegistration.RESIDENCY}',
          '${TypeOfRegistration.E_RESIDENCY}',
          '${TypeOfRegistration.LIMITED_E_RESIDENCY}'
        );
      `);
      }
      if (!statusTypeExists) {
        await client.query(`
        CREATE TYPE status AS ENUM (
          '${ResidentStatus.ACTIVE}',
          '${ResidentStatus.INACTIVE}'
        );
      `);
      }

      await client.query(`
      CREATE TABLE IF NOT EXISTS residents (
        sub SERIAL PRIMARY KEY,
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        fullname VARCHAR(255),
        permitNumber INT,
        permitNumberQrCode BYTEA NULL,
        dateOfBirth DATE,
        countryOfBirth VARCHAR(255),
        email VARCHAR(255),
        citizenship VARCHAR(255),
        gender VARCHAR(255),
        address JSONB,
        phoneNumber VARCHAR(255),
        typeOfRegistration registration,
        typeOfRegistrationSub VARCHAR(255) NULL,
        willWorkInPhysicalJurisdiction BOOLEAN,
        regulatoryElection VARCHAR(255) NULL,
        regulatoryElectionSub VARCHAR(255) NULL,
        firstRegistrationDate DATE,
        nextSubscriptionPaymentDate DATE,
        profilePicture BYTEA,
        status status,
        residencyEndDate DATE NULL
      );
    `);

      const insertResidentQuery = `
      INSERT INTO residents (
        firstName, 
        lastName, 
        fullName, 
        permitNumber, 
        dateOfBirth, 
        countryOfBirth, 
        email, 
        citizenship, 
        gender, 
        address, 
        phoneNumber, 
        typeOfRegistration, 
        willWorkInPhysicalJurisdiction, 
        firstRegistrationDate, 
        nextSubscriptionPaymentDate, 
        status
        ) 
        VALUES (
          'John', 
          'Doe', 
          'John Doe', 
          '12', 
          '1990-01-01', 
          'USA', 
          'john.doe@example', 
          'USA', 
          'M', 
          '{"country": "USA", "city": "NY", "state": "NY", "streetAddress": "123 st. 4", "isVerifiedAddress": false, "zipCode": "12345"}', 
          '123-456-7890', 
          '${TypeOfRegistration.RESIDENCY}',
          true, 
          '2020-01-01', 
          '2029-01-01', 
          '${ResidentStatus.ACTIVE}'
          );
      `;

      await client.query(insertResidentQuery);

      return { message: 'OK' };
    } catch (error) {
      console.error('Error during data migration:', error);
      throw error;
    } finally {
      if (client) {
        await client.end();
      }
    }
  }
}

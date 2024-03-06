import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class Resident {
    @PrimaryGeneratedColumn()
    sub: number;

    @Column({ length: 255, nullable: true })
    firstname: string;

    @Column({ length: 255, nullable: true })
    lastname: string;

    @Column({ length: 255, nullable: true })
    fullname: string;

    @Column({ nullable: true })
    permitnumber: number;

    @Column({ type: 'bytea', nullable: true })
    permitnumberqrcode: Buffer;

    @Column({ type: 'date', nullable: true })
    dateofbirth: Date;

    @Column({ length: 255, nullable: true })
    countryofbirth: string;

    @Column({ length: 255, nullable: true })
    email: string;

    @Column({ length: 255, nullable: true })
    citizenship: string;

    @Column({ length: 255, nullable: true })
    gender: string;

    @Column({ length: 255, nullable: true })
    phonenumber: string;

    @Column({ length: 3, nullable: true })
    country: string;

    @Column({ type: 'jsonb', nullable: true })
    address: object;

    @Column({ nullable: true })
    typeofregistration: string;

    @Column({ nullable: true })
    typeofregistrationsub: string;

    @Column({ nullable: true })
    willworkinphysicaljurisdiction: boolean;

    @Column({ length: 255, nullable: true })
    regulatoryelection: string;

    @Column({ length: 255, nullable: true })
    regulatoryelectionsub: string;

    @Column({ type: 'date', nullable: true })
    firstregistrationdate: Date;

    @Column({ type: 'date', nullable: true })
    firstregistrationpaymentdate: Date;

    @Column({ nullable: true })
    status: string;

    @Column({ type: 'date', nullable: true })
    residencyenddate: Date;

    @Column({ type: 'bytea', nullable: true })
    profilepicture: Buffer;

    @Column({ type: 'date', nullable: true })
    nextsubscriptionpaymentdate: Date;
}



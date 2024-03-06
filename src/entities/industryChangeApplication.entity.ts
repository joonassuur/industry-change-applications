import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Resident } from './resident.entity';

@Entity()
export class IndustryChangeApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    residentsub: number;

    @Column({ type: 'jsonb', nullable: true })
    current: object;

    @Column({ type: 'jsonb', nullable: true })
    requested: object;

    @Column({ nullable: true })
    status: string;

    @Column({ type: 'date', nullable: true })
    submittedat: Date;

    @Column({ type: 'jsonb', nullable: true })
    decision: object;

    @Column({ length: 255, nullable: true })
    createdby: string;

    @Column({ nullable: true })
    objectstatus: string;

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdat: Date;

    @ManyToOne(() => Resident)
    @JoinColumn({ name: 'residentsub', referencedColumnName: 'sub' })
    resident: Resident;
}

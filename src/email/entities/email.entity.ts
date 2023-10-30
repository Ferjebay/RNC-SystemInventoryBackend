import { Company } from "src/companies/entities/company.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('Email')
export class Email {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Company, (company) => company.emails, { eager: true })
    @JoinColumn({ name: 'company_id' })
    company_id: Company

    @Column({ type: 'varchar', length: 70 })
    host: string;

    @Column({ type: 'varchar', length: 70, nullable: true })
    seguridad: string;

    @Column({ type: 'varchar', length: 75 })
    usuario: string;
    
    @Column({ type: 'int' })
    puerto: number;
    
    @Column({ type: 'varchar', length: 75 })
    password: string;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}

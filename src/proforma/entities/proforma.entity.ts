import { Company } from 'src/companies/entities/company.entity';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn, Column } from 'typeorm';

@Entity('proforma')
export class Proforma {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Company, (company) => company.proforma)
    @JoinColumn({ name: 'company_id' })
    company_id: Company;

    @Column({ type: 'json', nullable: true, default: [] })
    clausulas?: { nombre: string, descripcion: string }[];

    @Column({ type: 'text', nullable: true })
    aceptacion_proforma?: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}


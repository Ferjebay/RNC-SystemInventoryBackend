import { Company } from "src/companies/entities/company.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('routers')
export class Router {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Company, (company) => company.router, { eager: true })
    @JoinColumn({ name: 'company_id' })
    company_id: Company

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 100 })
    user_api: string;

    @Column({ type: 'varchar', length: 70 })
    tipo_router: string;

    @Column({ type: 'varchar', length: 110 })
    password_api: string;

    @Column({ type: 'varchar', length: 80 })
    ubicacion: string;

    @Column({ type: 'varchar', length: 60 })
    registro_trafico: string;

    @Column({ type: 'varchar', length: 18 })
    ip_host: string;

    @Column({ type: 'varchar', length: 50 })
    control_velocidad: string;

    @Column({ type: 'varchar', length: 50 })
    seguridad: string;

    @Column({ type: 'int', nullable: true })
    puerto_api: number;

    @Column({ type: 'varchar', length: 50 })
    seguridad_alterna: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

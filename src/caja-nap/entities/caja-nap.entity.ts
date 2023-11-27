import { Company } from "src/companies/entities/company.entity";
import { Puerto } from "src/puertos/entities/puerto.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('cajas-nap')
export class CajaNap {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => Company, (company) => company.cajaNap, { eager: true })
    @JoinColumn({ name: 'company_id' })
    company_id?: Company;

    @OneToMany(() => Puerto, (puerto) => puerto.cajaNap_id, { eager: true })
    puertos?: Puerto[]

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 100 })
    coordenadas: string;

    @Column({ type: 'varchar', length: 100 })
    ubicacion: string;

    @Column({ type: 'varchar', length: 250 })
    detalles: string;

    @Column({ type: 'bool', default: true })
    isActive?: boolean;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

}

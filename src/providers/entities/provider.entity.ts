import { Buy } from 'src/buys/entities/buy.entity';
import { Company } from 'src/companies/entities/company.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('providers')
export class Provider {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Company, (company) => company.provider)
    company: Company

    @OneToMany(() => Buy, ( buy ) => buy.proveedor_id)
    buys: Buy[];

    @Column({ type: 'varchar', length: 200 })
    razon_social: string;
    
    @Column({ type: 'enum',  enum: ["Cedula", "RUC", "Pasaporte"], })
    tipo_documento: string;

    @Column({ type: 'varchar', unique: true })
    numero_documento: string;

    // Sin límite de 10: el selector de país guarda el número ya formateado
    // ("+593 98 659 0824"), igual que en clientes.
    @Column({ type: 'varchar', nullable: true })
    celular: string;

    @Column({ type: 'varchar', length: 75, unique: true, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    direccion: string;

    /** Nota interna del proveedor. No sale en ningún documento. */
    @Column({ type: 'text', nullable: true })
    observacion?: string;

    @Column({ type: 'enum', enum: ["NATURAL", "JURIDICA"], default: 'NATURAL' })
    tipo_persona: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

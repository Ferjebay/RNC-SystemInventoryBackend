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

    @Column({ type: 'varchar', length: 10 })
    celular: string;

    @Column({ type: 'varchar', length: 75, unique: true })
    email: string;
    
    @Column({ type: 'varchar', length: 75 })
    provincia: string;
    
    @Column({ type: 'varchar', length: 75 })
    ciudad: string;

    @Column({ type: 'varchar', length: 300 })
    direccion: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

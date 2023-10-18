import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('InvoiceElectronics')
export class InvoiceElectronic {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 13, unique: true })
    ruc: string;

    @Column({ type: 'varchar', length: 200 })
    nombre_comercial: string;

    @Column({ type: 'varchar', length: 200 })
    razon_social: string;

    @Column({ type: 'varchar', length: 200 })
    clave_certificado: string;

    @Column({ type: 'varchar', length: 200 })
    direccion_matriz: string;

    @Column({ type: 'bool' })
    obligado_contabilidad: boolean;

    @Column({ type: 'varchar', length: 75, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    celular?: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

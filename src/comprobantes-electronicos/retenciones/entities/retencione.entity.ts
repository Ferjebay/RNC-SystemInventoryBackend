import { User } from "src/auth/entities/user.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { Sucursal } from "src/sucursal/entities/sucursal.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PivotRetencion } from "./pivotRetencion";

@Entity('retenciones')
export class Retencion {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => Sucursal, (sucursal) => sucursal.retenciones)
    @JoinColumn({ name: 'sucursal_id' })
    sucursal_id: Sucursal;

    @ManyToOne(() => User, (user) => user.retenciones)
    @JoinColumn({ name: 'user_id' })
    user_id: User;

    @ManyToOne(() => Customer, (customer) => customer.retenciones)
    @JoinColumn({ name: 'customer_id' })
    customer_id: Customer;

    @OneToMany(() => PivotRetencion, (pivotRetencion) => pivotRetencion.retencion_id)
    pivot?: PivotRetencion[];

    @Column({ type: 'varchar', length: 50, unique: true })
    clave_acceso: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    clave_acceso_sustento: string;

    @Column({ type: 'varchar', length: 50 })
    numero_comprobante: string;

    @Column({ type: 'varchar' })
    tipo_documento: string;

    @Column({ type: 'text', nullable: true })
    descripcion?: string;

    @Column({ type: 'text' })
    fecha_emision_sustento?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    forma_pago?: string;

    @Column({ type: "decimal", precision: 8, scale: 2 })
    totalSinImpuestos: number;

    @Column({ type: "decimal", precision: 8, scale: 2 })
    importeTotal: number;

    @Column({ type: 'varchar', nullable: true })
    estadoSRI?: string;

    @Column({ type: 'varchar', nullable: true })
    respuestaSRI?: string;

    @Column({ type: 'bool', default: true })
    isActive?: boolean;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}

import { User } from "src/auth/entities/user.entity";
import { Company } from "src/companies/entities/company.entity";
import { Provider } from "src/providers/entities/provider.entity";
import { Sucursal } from "src/sucursal/entities/sucursal.entity";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { FormaPago } from "../enums/forma-pago.enum";

export type IngresoEgresoTipo = 'ingreso' | 'egreso';

/**
 * Libro de caja: movimientos de dinero que no pasan por la facturación.
 *
 * A diferencia de ISPMAX, acá no hay cobros de servicio ni routers: solo
 * ingresos y egresos cargados a mano.
 */
@Entity('ingresos_egresos')
export class IngresoEgreso {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'enum', enum: ['ingreso', 'egreso'], default: 'egreso' })
    tipo: IngresoEgresoTipo;

    /** Sin esto los movimientos de todas las empresas se mezclan en un mismo listado. */
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company_id: Company;

    @ManyToOne(() => Sucursal, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'sucursal_id' })
    sucursal_id?: Sucursal | null;

    /** Quién registró el movimiento. */
    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'user_id' })
    user_id?: User | null;

    @ManyToOne(() => Provider, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'proveedor_id' })
    proveedor_id?: Provider | null;

    @Column({ type: 'varchar', length: 255 })
    referencia: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    forma_pago?: FormaPago | null;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    monto: number;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    fecha: string;

    @Column({ type: 'text', nullable: true })
    descripcion?: string;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

    /** Borrado suave: un movimiento eliminado no debe desaparecer del historial contable. */
    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
    deletedAt?: Date;
}

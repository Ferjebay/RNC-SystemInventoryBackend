import { ServicioCliente } from "src/customers/entities/ServicioCliente.entity";
import { Sucursal } from "src/sucursal/entities/sucursal.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('pagos')
export class Pago {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => ServicioCliente, ( servicioCliente ) => servicioCliente.pago, { eager: true })
    @JoinColumn({ name: 'servicio_id' })
    servicio?: ServicioCliente;

    @ManyToOne(() => Sucursal, (sucursal) => sucursal.pagos, { nullable: true, eager: true })
    @JoinColumn({ name: 'sucursal_id' })
    sucursal_id?: Sucursal;

    @Column({ type:'json', nullable: true, default: [] })
    pagos: { 
        forma_pago: string,
        valor: string; 
        monto_pendiente: string; 
        totalAbonado: string; 
        fecha_abono: string, 
        hora_abono: string, 
        n_transaccion: string, 
        detalle?: string 
    }[];

    @Column({ type: 'varchar', length: 55, nullable: true })
    estadoSRI: string;

    @Column({ type: 'varchar', length: 25, nullable: true })
    num_comprobante?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    clave_acceso?: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    respuestaSRI?: string;

    @Column({ type: 'date' })
    dia_pago?: Date;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

}

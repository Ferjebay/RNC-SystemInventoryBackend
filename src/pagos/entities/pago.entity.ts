import { ServicioCliente } from "src/customers/entities/ServicioCliente.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('pagos')
export class Pago {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => ServicioCliente, ( servicioCliente ) => servicioCliente.pago, { eager: true })
    @JoinColumn({ name: 'servicio_id' })
    servicio?: ServicioCliente;

    @Column({ type:'json', nullable: true, default: [] })
    pagos: { 
        forma_pago: string,
        valor: string; 
        fecha_abono: string, 
        n_transaccion: string, 
        detalle?: string 
    }[];

    @Column({ type: 'varchar', length: 25, nullable: true })
    estadoSRI: string;

    @Column({ type: 'varchar', length: 25, nullable: true })
    num_comprobante?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    clave_acceso?: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    respuestaSRI?: string;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

}

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { ServicioCliente } from "./ServicioCliente.entity";

@Entity('factura-clientes')
export class FacturaCliente {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => Customer, (customer) => customer.facturaCliente)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer

    @OneToMany(() => ServicioCliente, ( servicioCliente ) => servicioCliente.factura_id)
    servicio_id?: ServicioCliente[];

    @Column({ type: 'varchar', length: 70 })
    tipo: string;

    @Column({ type: 'int' })
    dia_pago: number;

    @Column({ type: 'varchar', length: 20 })
    crear_factura: string;

    @Column({ type: 'varchar', length: 25 })
    tipo_impuesto: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    tipo_comprobante: string;

    @Column({ type: 'varchar', length: 10 })
    dia_gracia: string

    @Column({ type: 'varchar', length: 25 })
    aplicar_corte: string;

    @Column({ type: 'varchar',  array: true, length: 12 })
    recordatorio_pago: string[];

}

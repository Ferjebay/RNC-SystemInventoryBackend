import { User } from "src/auth/entities/user.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { Sucursal } from "src/sucursal/entities/sucursal.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn, OneToMany } from 'typeorm';
import { InvoiceToProduct } from './invoiceToProduct.entity';

@Entity('invoices')
export class Invoice {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => Sucursal, (sucursal) => sucursal.invoices)
    @JoinColumn({ name: 'sucursal_id' })
    sucursal_id: Sucursal;

    @ManyToOne(() => User, (user) => user.invoices)
    @JoinColumn({ name: 'user_id' })
    user_id: User;

    @ManyToOne(() => Customer, (customer) => customer.invoices)
    @JoinColumn({ name: 'customer_id' })
    customer_id: Customer;

    @OneToMany(() => InvoiceToProduct, (invoiceToproduct) => invoiceToproduct.invoice_id)
    invoiceToProduct?: InvoiceToProduct[];

    @Column({ type: 'varchar', length: 50, unique: true })
    clave_acceso: string;

    @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
    clave_acceso_nota_credito?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    name_proforma?: string;

    @Column({ type: 'varchar', length: 50 })
    numero_comprobante: string;

    @Column({ type: 'text', nullable: true })
    descripcion?: string;

    @Column({ type: 'varchar', length: 2, nullable: true })
    porcentaje_iva: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    forma_pago?: string;

    @Column({ type: "decimal", precision: 8, scale: 2 })
    subtotal: number;

    @Column({ type: "decimal", precision: 8, scale: 2 })
    descuento: number;

    @Column({ type: "decimal", precision: 8, scale: 2 })
    iva: number;

    @Column({ type: "decimal", precision: 8, scale: 2 })
    total: number;

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

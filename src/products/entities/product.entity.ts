import { BuyToProduct } from "src/buys/entities/buyToProduct.entity";
import { InvoiceToProduct } from "src/invoices/entities/invoiceToProduct.entity";
import { Sucursal } from "src/sucursal/entities/sucursal.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('products')
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Sucursal, (sucursal) => sucursal.products)
    @JoinColumn({ name: 'sucursal_id' })
    sucursal_id: Sucursal;

    @OneToMany(() => InvoiceToProduct, (invoiceToproduct) => invoiceToproduct.product_id)
    invoiceToProduct: InvoiceToProduct[];

    @OneToMany(() => BuyToProduct, (buyToProduct) => buyToProduct.product_id)
    buyToProduct: BuyToProduct[];

    @Column({ type: 'varchar', length: 20 })
    codigoBarra: string;

    @Column('bool')
    aplicaIva: boolean;

    @Column({ type: 'varchar', length: 60 })
    nombre: string;

    @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
    precio_compra: number;

    @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
    pvp: number;

    @Column({ type: "int", default: 0 })
    stock: number;

    @Column({ type: 'int', default: 0 })
    descuento: number;

    @Column({ type: 'varchar', nullable: true })
    tipo: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

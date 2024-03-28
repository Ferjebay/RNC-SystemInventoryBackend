import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Product } from "src/products/entities/product.entity";
import { Invoice } from "./invoice.entity";

@Entity('InvoiceToProduct')
export class InvoiceToProduct {

    constructor(cantidad: number, v_total: number, descuento: number, invoice_id: Invoice, product_id: Product){
        this.cantidad = cantidad;
        this.v_total = v_total;
        this.product_id = product_id;
        this.descuento = descuento;
        this.invoice_id = invoice_id
    }

    @PrimaryGeneratedColumn('uuid')
    public invoice_product_id: number;

    @Column({ type: 'int' })
    public cantidad: number

    @Column({ type: "decimal", precision: 8, scale: 2 })
    public v_total: number;

    @Column({ type: "decimal", precision: 8, scale: 2 })
    public descuento: number;

    @ManyToOne(() => Invoice, (invoice) => invoice.invoiceToProduct)
    @JoinColumn({ name: 'invoice_id' })
    public invoice_id: Invoice;

    @ManyToOne(() => Product, (product) => product.invoiceToProduct )
    @JoinColumn({ name: 'product_id' })
    public product_id: Product;

    @CreateDateColumn()
    created_at?: Date;

}
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

    /**
     * Se conserva por compatibilidad: el armador de comprobantes y la carga
     * masiva siguen trabajando con el sí/no. Se mantiene en sincronía con
     * `impuesto` (aplicaIva = impuesto > 0).
     */
    @Column('bool')
    aplicaIva: boolean;

    /** Tarifa de IVA del producto (0, 12, 14, 15). */
    @Column({ type: 'int', default: 0 })
    impuesto: number;

    /**
     * ICE (Impuesto a Consumos Especiales), opcional:
     *   ice       → null | 'tarifa' (porcentaje) | 'valor' (monto fijo)
     *   valor_ice → el porcentaje o el monto, según lo anterior
     *   tipo_ice  → código del catálogo del SRI (3000, 3011, …)
     */
    @Column({ type: 'text', nullable: true })
    ice: string;

    @Column({ type: 'numeric', nullable: true })
    valor_ice: number;

    @Column({ type: 'numeric', nullable: true })
    tipo_ice: number;

    @Column({ type: 'text', nullable: false })
    nombre: string;

    @Column({ type: "decimal", nullable: true, precision: 8, scale: 2, default: 0 })
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

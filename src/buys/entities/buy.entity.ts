import { Product } from "src/products/entities/product.entity";
import { Provider } from "src/providers/entities/provider.entity";
import { Sucursal } from "src/sucursal/entities/sucursal.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BuyToProduct } from "./buyToProduct.entity";
import { User } from "src/auth/entities/user.entity";

@Entity('buys')
export class Buy {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => Sucursal, (sucursal) => sucursal.buys)
    @JoinColumn({ name: 'sucursal_id' })
    sucursal_id: Sucursal;

    @ManyToOne(() => Provider, (provider) => provider.buys, { eager: true }  )
    @JoinColumn({ name: 'proveedor_id' })
    proveedor_id: Provider;

    @OneToMany(() => BuyToProduct, (buyToproduct) => buyToproduct.buy_id)
    buyToProduct?: BuyToProduct[];

    @ManyToOne(() => User, (user) => user.invoices)
    @JoinColumn({ name: 'user_id' })
    user_id: User;

    @Column({ type: 'varchar', length: 50 })
    numero_comprobante: string;

    @Column({ type: 'varchar', length: 50 })
    descripcion: string;

    @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
    subtotal: number;

    @Column({ type: "decimal", precision: 8, scale: 2 })
    descuento: number;

    @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
    iva: number;

    @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
    total: number;

    @Column({ type: "varchar" })
    fecha_compra: string;

    @Column({ type: 'bool', default: true })
    isActive?: boolean;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}

import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from "src/products/entities/product.entity";
import { Buy } from './buy.entity';

@Entity('BuyToProduct')
export class BuyToProduct {

    constructor(  cantidad: number, v_total: number, buy_id: Buy, product_id: Product ){
        this.cantidad = cantidad;
        this.v_total = v_total;
        this.product_id = product_id;
        this.buy_id = buy_id
    }

    @PrimaryGeneratedColumn('uuid')
    public buy_product_id: number;

    @Column({ type: 'int' })
    public cantidad: number

    @Column({ type: "decimal", precision: 8, scale: 2 })
    public v_total: number;

    @ManyToOne(() => Buy, (buy) => buy.buyToProduct)
    @JoinColumn({ name: 'buy_id' })
    public buy_id: Buy;

    @ManyToOne(() => Product, (product) => product.buyToProduct )
    @JoinColumn({ name: 'product_id' })
    public product_id: Product;

}
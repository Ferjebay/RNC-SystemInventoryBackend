import { Buy } from "src/buys/entities/buy.entity";
import { Company } from "src/companies/entities/company.entity";
import { Invoice } from "src/invoices/entities/invoice.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export type EnviromentType = "PRODUCCION" | "PRUEBA";

@Entity('sucursales')
export class Sucursal {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Company, (company) => company.sucursal)
    @JoinColumn({ name: 'company_id' })
    company_id: Company;

    //------------ Relaciones Secundarias --------
    @OneToMany(() => Buy, (buy) => buy.sucursal_id)
    buys: Buy[];

    @OneToMany(() => Invoice, (invoice) => invoice.sucursal_id)
    invoices: Invoice[];

    @OneToMany(() => Product, (product) => product.sucursal_id)
    products: Product[];
    //-----------------------------------------------

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 255 })
    direccion: string;

    @Column({ type: 'int' })
    establecimiento: number;

    @Column({ type: 'int' })
    punto_emision: number;

    @Column({ type: 'int' })
    secuencia_factura_produccion: number;

    @Column({ type: 'int', nullable: true, default: 1 })
    secuencia_factura_pruebas?: number;

    @Column({ type: 'enum',  enum: ["PRODUCCION", "PRUEBA"], default: 'PRUEBA' })
    ambiente: EnviromentType;
    
    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

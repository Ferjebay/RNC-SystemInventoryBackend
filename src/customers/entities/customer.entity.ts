import { Company } from "src/companies/entities/company.entity";
import { Invoice } from "src/invoices/entities/invoice.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('customers')
export class Customer {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Invoice, (invoice) => invoice.customer_id)
    invoices: Invoice[];

    @ManyToOne(() => Company, (company) => company.customer)
    @JoinColumn({ name: 'company_id' })
    company_id: Company

    @Column({ type: 'varchar', length: 200 })
    nombres: string;

    @Column({ type: 'enum',  enum: ["04", "05", "06", "07"], })
    tipo_documento: string;

    @Column({ type: 'varchar', unique: true })
    numero_documento: string;

    @Column({ type: 'varchar', length: 10 })
    celular: string;

    @Column({ type: 'varchar', length: 75, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 300 })
    direccion: string;
    
    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

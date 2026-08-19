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

    @Column({ type: 'varchar' })
    numero_documento: string;

    @Column({ type: 'varchar', nullable: true })
    celular: string;

    @Column({ type: 'varchar', length: 75, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    direccion: string;

    /** Nota interna del cliente. No sale en el comprobante. */
    @Column({ type: 'text', nullable: true })
    observacion?: string;

    @Column({ type: 'enum', enum: ["NATURAL", "JURIDICA"], default: 'NATURAL' })
    tipo_persona: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

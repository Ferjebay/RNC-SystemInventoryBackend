import { Buy } from "src/buys/entities/buy.entity";
import { Company } from "src/companies/entities/company.entity";
import { Invoice } from "src/invoices/entities/invoice.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Invoice, (invoice) => invoice.user_id)
    invoices: Invoice[]

    @OneToMany(() => Buy, (buy) => buy.user_id)
    buys: Buy[]

    @ManyToOne(() => Company, (company) => company.users )
    company: Company

    @Column({ type: 'uuid', array: true, nullable: true })
    sucursales: string[];

    @Column({ type: 'text', nullable: true, unique: true })
    email: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'text', nullable: false })
    usuario: string;

    @Column({ type: 'text', nullable: false })
    fullName: string;
    
    // @Column({ type: 'text', unique: true })
    // cedula: string;
    
    @Column({ type: 'text' })
    celular: string;

    @Column({ type: 'text', nullable: true })
    facebook?: string;

    @Column({ type: 'text', nullable: true })
    twitter?: string;
    
    @Column({ type: 'text', array: true })
    roles: string[];

    @Column({ type: 'text', array: true })
    permisos: string[];

    @Column({ type: 'text', array: true, nullable: true })
    horarios_dias: string[];

    @Column({ type: 'text', array: true, nullable: true })
    horarios_time: string[];

    @Column({ type: 'bool' })
    receiveSupportEmail: boolean;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    checkFielsBeforeInsert(){
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkFielsBeforeUpdate(){
        this.checkFielsBeforeInsert()
    }

}

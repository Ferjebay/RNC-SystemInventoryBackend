import { CajaNap } from "src/caja-nap/entities/caja-nap.entity";
import { Company } from "src/companies/entities/company.entity";
import { ServicioCliente } from "src/customers/entities/ServicioCliente.entity";
import { Internet } from "src/internet/entities/internet.entity";
import { RedIpv4 } from "src/red-ipv4/entities/red-ipv4.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('routers')
export class Router {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Company, (company) => company.router, { eager: true })
    @JoinColumn({ name: 'company_id' })
    company_id: Company

    @OneToMany(() => Internet, (internet) => internet.router_id)
    internet: Internet[]

    @OneToMany(() => ServicioCliente, (servicioCliente) => servicioCliente.router_id)
    plan_internet: ServicioCliente[]

    @OneToMany(() => CajaNap, (cajaNap) => cajaNap.router_id)
    cajaNap: CajaNap[]

    @OneToMany(() => RedIpv4, (redIpv4) => redIpv4.router_id)
    redes: RedIpv4[]

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 100 })
    user_api: string;

    @Column({ type: 'varchar', length: 70 })
    tipo_router: string;

    @Column({ type: 'varchar', length: 110, nullable: true })
    password_api: string;

    @Column({ type: 'varchar', length: 80 })
    ubicacion: string;

    @Column({ type: 'varchar', length: 60 })
    registro_trafico: string;

    @Column({ type: 'varchar', length: 18 })
    ip_host: string;

    @Column({ type: 'varchar', length: 50 })
    control_velocidad: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    seguridad: string;

    @Column({ type: 'int', nullable: true })
    puerto_api: number;

    @Column({ type: 'varchar', length: 50 })
    seguridad_alterna: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

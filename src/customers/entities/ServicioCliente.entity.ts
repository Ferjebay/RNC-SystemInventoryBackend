import { Column, Entity, JoinColumn, ManyToOne,  PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { Router } from "src/router/entities/router.entity";
import { Internet } from "src/internet/entities/internet.entity";
import { RedIpv4 } from "src/red-ipv4/entities/red-ipv4.entity";
import { CajaNap } from "src/caja-nap/entities/caja-nap.entity";
import { Puerto } from "src/puertos/entities/puerto.entity";

@Entity('servicios-clientes')
export class ServicioCliente {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Customer, (customer) => customer.planInternet)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @ManyToOne(() => Router, (router) => router.plan_internet, { eager: true })
    @JoinColumn({ name: 'router_id' })
    router_id: Router;

    @ManyToOne(() => Internet, (internet) => internet.plan_internet, { eager: true })
    @JoinColumn({ name: 'perfil_internet' })
    perfil_internet: Internet;

    @ManyToOne(() => RedIpv4, (redIPv4) => redIPv4.plan_internet, { eager: true })
    @JoinColumn({ name: 'red_id' })
    red_id: RedIpv4;

    @ManyToOne(() => CajaNap, (cajaNap) => cajaNap.plan_internet, { eager: true, nullable: true })
    @JoinColumn({ name: 'caja_id' })
    caja_id?: CajaNap;

    @ManyToOne(() => Puerto, (puerto) => puerto.plan_internet, { eager: true, nullable: true })
    @JoinColumn({ name: 'puerto_id' })
    puerto_id?: Puerto;

    @Column({ type: 'varchar', length: 150, nullable: true })
    direccion?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    coordenadas?: string;

    @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
    precio: number;

    @Column({ type: "date" })
    fecha_instalacion: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    mac?: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    ipv4: string;
}

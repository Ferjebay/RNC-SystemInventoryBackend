import { ServicioCliente } from "src/customers/entities/ServicioCliente.entity";
import { Puerto } from "src/puertos/entities/puerto.entity";
import { Router } from "src/router/entities/router.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('cajas-nap')
export class CajaNap {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => Router, (router) => router.cajaNap, { eager: true })
    @JoinColumn({ name: 'router_id' })
    router_id: Router;

    @OneToMany(() => Puerto, (puerto) => puerto.cajaNap_id, { eager: true })
    puertos?: Puerto[]

    @OneToMany(() => ServicioCliente, (servicioCliente) => servicioCliente.caja_id)
    plan_internet: ServicioCliente[]

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 100 })
    coordenadas: string;

    @Column({ type: 'varchar', length: 100 })
    ubicacion: string;

    @Column({ type: 'varchar', length: 250 })
    detalles: string;

    @Column({ type: 'bool', default: true })
    isActive?: boolean;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

}

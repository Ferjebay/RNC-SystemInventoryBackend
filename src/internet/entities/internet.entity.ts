import { Router } from "src/router/entities/router.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('internet')
export class Internet {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Router, (router) => router.internet, { eager: true })
    @JoinColumn({ name: 'router_id' })
    router_id: Router;

    @Column({ type: 'varchar', length: 100 })
    nombre_plan: string;

    @Column({ type: 'varchar', length: 100 })
    descripcion: string;

    @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
    precio_plan: number;
    
    @Column({ type: "int", default: 0 })
    impuesto: number;

    @Column({ type: "int", default: 0 })
    descarga_Mbps: number;

    @Column({ type: "int", default: 0 })
    subida_Mbps: number;

    @Column({ type: "int", default: 0 })
    limit_at: number;

    @Column({ type: "int", default: 0 })
    burst_limit: number;

    @Column({ type: 'int' })
    prioridad: number;

    @Column({ type: 'varchar', length: 100 })
    address_list: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

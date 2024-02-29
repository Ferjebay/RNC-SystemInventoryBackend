import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('roles-and-permisos')
export class RolAndPermiso {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    nombre: string;

    @Column({ type: 'text', array: true })
    permisos: string[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

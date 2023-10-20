import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('Email')
export class Email {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 70 })
    host: string;

    @Column({ type: 'varchar', length: 75 })
    usuario: string;
    
    @Column({ type: 'int' })
    puerto: number;
    
    @Column({ type: 'varchar', length: 75 })
    password: string;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}

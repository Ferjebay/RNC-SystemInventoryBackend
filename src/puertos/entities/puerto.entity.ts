import { CajaNap } from "src/caja-nap/entities/caja-nap.entity";
import { ServicioCliente } from "src/customers/entities/ServicioCliente.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('puertos')
export class Puerto {

    constructor( cajaNap_id: CajaNap, puerto: number ){
      this.cajaNap_id = cajaNap_id,
      this.puerto = puerto
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => CajaNap, (cajaNap) => cajaNap.puertos, { onDelete: 'CASCADE'  })
    @JoinColumn({ name: 'cajaNap_id' })
    cajaNap_id: CajaNap;

    @OneToMany(() => ServicioCliente, (servicioCliente) => servicioCliente.puerto_id)
    plan_internet: ServicioCliente[]

    @Column({ type: 'int' })
    puerto: number;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

}

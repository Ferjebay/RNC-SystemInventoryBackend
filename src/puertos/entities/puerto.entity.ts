import { CajaNap } from "src/caja-nap/entities/caja-nap.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ type: 'int' })
    puerto: number;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

}

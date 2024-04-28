import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';
import { Retencion } from './retencione.entity';

@Entity('PivotRetencion')
export class PivotRetencion {

  constructor(
      tipo_impuesto: string,
      codigo_retencion: string,
      porcentaje_retencion: number,
      valor_retenido: number,
      base_imponible: number,
      retencion_id: Retencion
    ){
    this.tipo_impuesto        = tipo_impuesto;
    this.codigo_retencion     = codigo_retencion;
    this.porcentaje_retencion = porcentaje_retencion;
    this.valor_retenido       = valor_retenido;
    this.base_imponible       = base_imponible;
    this.retencion_id         = retencion_id;
  }

  @PrimaryGeneratedColumn('uuid')
  public retencion_pivot_id: number;

  @Column({ type: 'varchar', length: 200 })
  tipo_impuesto: string;

  @Column({ type: 'varchar', length: 10 })
  codigo_retencion: string;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  porcentaje_retencion: number;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  public valor_retenido: number;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  public base_imponible: number;

  @ManyToOne(() => Retencion, (retencion) => retencion.pivot)
  @JoinColumn({ name: 'retencion_id' })
  public retencion_id: Retencion;

  @CreateDateColumn()
  created_at?: Date;

}
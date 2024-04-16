import { Injectable } from '@nestjs/common';
import { CreateRetencioneDto } from './dto/create-retencione.dto';
import { UpdateRetencioneDto } from './dto/update-retencione.dto';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RetencionesService {

  constructor(
    @InjectRepository( Sucursal )
    private readonly sucursalRepository: Repository<Sucursal>,
  ){}

  async getNumComprobante( sucursal_id: any ){
    let query = `
        CASE
          WHEN (ambiente = 'PRODUCCION') THEN sucursal.secuencia_retencion_produccion
          ELSE sucursal.secuencia_retencion_pruebas
        END`

    const queryBuilder = this.sucursalRepository.createQueryBuilder('sucursal');
    let { ambiente, establecimiento, punto_emision, secuencial } = await queryBuilder
      .select(["establecimiento", "punto_emision", "ambiente"])
      .addSelect(query, "secuencial")
      .where("id = :id", { id: sucursal_id })
      .getRawOne();

    establecimiento = establecimiento.toString().padStart(3, '0')
    punto_emision   = punto_emision.toString().padStart(3, '0')
    secuencial      = secuencial.toString().padStart(9, '0')

    const numComprobante = `${ establecimiento }-${ punto_emision }-${ secuencial }`

    return { numComprobante, ambiente };
  }

  create(createRetencioneDto: CreateRetencioneDto) {
    return 'This action adds a new retencione';
  }

  findAll() {
    return `This action returns all retenciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} retencione`;
  }

  update(id: number, updateRetencioneDto: UpdateRetencioneDto) {
    return `This action updates a #${id} retencione`;
  }

  remove(id: number) {
    return `This action removes a #${id} retencione`;
  }
}

import { Injectable, BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateBuyDto } from './dto/create-buy.dto';
import { UpdateBuyDto } from './dto/update-buy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Buy } from './entities/buy.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { BuyToProduct } from './entities/buyToProduct.entity';

@Injectable()
export class BuysService {

  private readonly logger = new Logger('BuyService');

  constructor(
    @InjectRepository(Buy)
    private readonly buyRepository: Repository<Buy>,
    @InjectRepository(BuyToProduct)
    private readonly tablePivotRepository: Repository<BuyToProduct>,
  ){}

  async create(createBuyDto: CreateBuyDto, sucursal_id: Sucursal) {
    try {
      
      let buyEntity = new Buy();
      buyEntity = {
        ...createBuyDto,
        sucursal_id
      }
      
      const buyCreated = await this.buyRepository.save( buyEntity );

      const pivot: Array<BuyToProduct> = [];      
      createBuyDto.products.forEach( p => {
        pivot.push(new BuyToProduct(
          p.cantidad,
          p.v_total,
          buyCreated,
          p.id
        ));        
      })
      this.tablePivotRepository.save( pivot );
  
      return buyCreated;      
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  async findAll( estado: boolean, sucursal_id: Sucursal ) {
    let option:any = { 
      relations: {         
        buyToProduct: { product_id: true },
        sucursal_id: true,
        user_id: true
      }, 
      select: { 
        user_id:     { fullName: true },
        sucursal_id: { nombre: true }, 
        buyToProduct: { v_total: true, cantidad: true, product_id: true }
      },
      where: { sucursal_id: { id: sucursal_id } }, 
      order: { created_at: "DESC" } 
    }

    if ( estado ) option.where = { isActive: true };

    return await this.buyRepository.find( option );
  }

  async findOne(term: string) {
    let buy: Buy[];

    if ( isUUID(term) ) {
      buy = await this.buyRepository.findBy({ id: term });
    } else {
      const queryBuilder = this.buyRepository.createQueryBuilder('buy'); 
      buy = await queryBuilder
        .where('UPPER(descripcion) =:descripcion', {
          descripcion: term.toUpperCase()
        })        
        .getMany();
    }

    if ( buy.length === 0 ) 
      throw new NotFoundException(`buy with ${ term } not found`);

    return buy;
  }

  async update(id: string, updateBuyDto: UpdateBuyDto) {
    await this.findOne( id );

    try {
      await this.buyRepository.update( id, updateBuyDto );

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };      

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async setEstado(id: string, estado: boolean) {
    if ( estado ) 
      await this.buyRepository.update( id, { isActive: true })
    else
      await this.buyRepository.update( id, { isActive: false })

    return { ok: true, msg: 'Actualizado Exitosamente' };
  }

  async remove( id: string ) {
    const buy = await this.findOne( id );
    let msg: string; 

    await this.buyRepository.remove( buy );
    msg = 'Eliminado Exitosamente'
    
    return { ok: true, msg };
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

import { Injectable, BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProformaDto } from './dto/create-proforma.dto';
import { UpdateProformaDto } from './dto/update-proforma.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proforma } from './entities/proforma.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class ProformaService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository( Proforma )
    private readonly proformaRepository: Repository<Proforma>
  ){}

  async create(createProformaDto: CreateProformaDto, company_id: Company) {
    try {

      const proforma = await this.findOne( company_id );

      if ( proforma ) {
        proforma.clausulas = createProformaDto.clausulas
        proforma.aceptacion_proforma = createProformaDto.aceptacion_proforma
      
        this.proformaRepository.update( proforma.id, proforma )
      }else{
        const clausula = await this.proformaRepository.create( proforma );
  
        await this.proformaRepository.save( clausula );
      }  
      return "todo ok";  

    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  async findOne(id: any) {
    let proforma: Proforma;

    proforma = await this.proformaRepository.findOne({
      where: [
        { id: id },
        { company_id: { id } }
      ]
    })

    return proforma;
  }

  async update(id: string, updateProformaDto: UpdateProformaDto) {
    await this.proformaRepository.update( id, { ...updateProformaDto })
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

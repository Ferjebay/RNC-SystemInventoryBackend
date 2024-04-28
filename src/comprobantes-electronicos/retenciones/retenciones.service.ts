import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateRetencioneDto } from './dto/create-retencione.dto';
import { UpdateRetencioneDto } from './dto/update-retencione.dto';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FacturasService } from '../facturas/facturas.service';
import { CustomersService } from 'src/customers/customers.service';
import { PivotRetencion } from './entities/pivotRetencion';
import { Retencion } from './entities/retencione.entity';
const builder = require("xmlbuilder");
const path = require('path');
const fs = require("fs");
const { execSync } = require('node:child_process');

const moment = require('moment');

@Injectable()
export class RetencionesService {

  constructor(
    @InjectRepository( Sucursal )
    private readonly sucursalRepository: Repository<Sucursal>,
    @InjectRepository( PivotRetencion )
    private readonly tablePivotRepository: Repository<PivotRetencion>,
    @InjectRepository( Retencion )
    private readonly retencionRepository: Repository<Retencion>,

    private readonly customerService: CustomersService,
    @Inject(forwardRef(() => FacturasService))
    private readonly facturaService: FacturasService
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

  async generarRetencion( datosRetencion) {

    const infoCompany = await this.sucursalRepository.find({
      relations: { company_id: true },
      select: {
        company_id: {
          ruc: true,
          razon_social: true,
          direccion_matriz: true,
          obligado_contabilidad: true,
          nombre_comercial: true,
          clave_certificado: true,
          archivo_certificado: true,
          email: true,
          telefono: true,
          logo: true,
          iva: true
        }
      },
      where: { id: datosRetencion.sucursal_id.id }
    });

    let porcentaje_iva;
    if ( +infoCompany[0].company_id.iva == 4 ) porcentaje_iva = 15
    if ( +infoCompany[0].company_id.iva == 3 ) porcentaje_iva = 14
    if ( +infoCompany[0].company_id.iva == 2 ) porcentaje_iva = 12

    const total_base_imponible = datosRetencion.impuestos.reduce(( suma, impuesto ) => {
      return suma + impuesto.base_imponible
    }, 0);

    const importeTotal = (((total_base_imponible * porcentaje_iva) / 100) + total_base_imponible).toFixed(2);

    const claveAcceso = await this.facturaService.getClaveAcceso(datosRetencion.sucursal_id, 'retencion');

    const retencion_id = await this.saveRetencionDB(datosRetencion, total_base_imponible, importeTotal, claveAcceso)

    const infoTributaria = {
      ambiente:         infoCompany[0].ambiente == 'PRUEBA' ? 1 : 2,
      tipoEmision:      1,
      razonSocial:      infoCompany[0].company_id.razon_social,
      nombreComercial:  infoCompany[0].company_id.nombre_comercial,
      ruc:              infoCompany[0].company_id.ruc,
      claveAcceso:      claveAcceso,
      codDoc:           '07', //Retencion
      estab:            claveAcceso.substring(24, 27),
      ptoEmi:           claveAcceso.substring(27, 30),
      secuencial:       claveAcceso.substring(30, 39),
      dirMatriz:        infoCompany[0].company_id.direccion_matriz
    };

    const customer = await this.customerService.findOne( datosRetencion.customer_id );

    const infoCompRetencion = {
      fechaEmision:                     moment().format('DD/MM/YYYY'),
      dirEstablecimiento:               customer[0].direccion,
      obligadoContabilidad: 'NO',
      tipoIdentificacionSujetoRetenido: customer[0].tipo_documento,
      parteRel:             'NO',
      razonSocialSujetoRetenido:        customer[0].nombres,
      identificacionSujetoRetenido:     customer[0].numero_documento,
      periodoFiscal:                    moment().format('MM/YYYY')
    };

    let codSustento;
    if ( datosRetencion.tipo_documento == 'FACTURA' ) codSustento = '01'

    const arrayDate = datosRetencion.inputDate.split('/');

    const retenciones = datosRetencion.impuestos.map( impuesto => {
      let codigo;
      if (impuesto.tipo_impuesto == 'IVA') codigo = 2;

      return {
        retencion:{
          codigo,
          codigoRetencion: impuesto.retencion,
          baseImponible: impuesto.base_imponible,
          porcentajeRetener: impuesto.porcentaje_iva,
          valorRetenido: impuesto.valor_retenido
        }
      }
    })

    const docsSustento = {
      docSustento: {
        codSustento,
        codDocSustento: codSustento,
        numDocSustento: datosRetencion.numero_comprobante.replace(/-/g, ''),
        fechaEmisionDocSustento: `${ arrayDate[2] }/${ arrayDate[1] }/${ arrayDate[0] }`,
        fechaRegistroContable: `${ arrayDate[2] }/${ arrayDate[1] }/${ arrayDate[0] }`,
        numAutDocSustento: datosRetencion.clave_acceso,
        pagoLocExt: '01',
        totalSinImpuestos: total_base_imponible.toFixed(2),
        importeTotal,
        impuestosDocSustento: {
          impuestoDocSustento: {
            codImpuestoDocSustento: 2,
            codigoPorcentaje: +infoCompany[0].company_id.iva,
            baseImponible: total_base_imponible.toFixed(2),
            tarifa: porcentaje_iva.toFixed(2),
            valorImpuesto: ((total_base_imponible * porcentaje_iva) / 100).toFixed(2)
          }
        },
        retenciones: retenciones,
        pagos: {
          pago: {
            formaPago: 20,
            total: importeTotal
          }
        }
      }
    };

    var obj = {
      comprobanteRetencion: {
        '@id': 'comprobante',
        '@version': "2.0.0",
        infoTributaria,
        infoCompRetencion,
        docsSustento
      }
    };

    const nombreComercial = infoCompany[0].company_id.ruc;

    var xml = builder.create(obj, { encoding: 'UTF-8' }).end({ pretty: true});

    const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }`);

    const java = process.env.JAVA_PATH;
    const pathCertificado = path.resolve(__dirname, `../../../static/SRI/FIRMAS/${ infoCompany[0].company_id.archivo_certificado }`);

    try {
      await fs.mkdirSync(path.dirname(`${ pathXML }/retenciones/Generados/${ claveAcceso }.xml`), {recursive: true, })
      await fs.writeFileSync(`${ pathXML }/retenciones/Generados/${ claveAcceso }.xml`, xml, {flag: 'w+', encoding: 'utf-8'})

      await fs.mkdirSync(path.dirname(`${ pathXML }/retenciones/Firmados/${ claveAcceso }.xml`), {recursive: true})
      await fs.writeFileSync(`${ pathXML }/retenciones/Firmados/${ claveAcceso }.xml`, "", {flag: 'w+', encoding: 'utf-8'})
    } catch (err) {
      console.log(err)
    }

    //---------------- Firmar XML--------------------------
    const cmd = java + ' -jar "' + path.resolve('static/resource/jar/firmaxml1 (1).jar') + '" "' + `${ pathXML }/retenciones/Generados/${ claveAcceso }.xml` + '" "' + pathCertificado + '" "' + infoCompany[0].company_id.clave_certificado + '" "' + `${ pathXML }/retenciones/Firmados/${ claveAcceso }.xml` + '"';

    try {
      await execSync(cmd)
    } catch (err) {
      return console.log('error firma: ', err)
    }
    //--------------------------------------------------------------------------

    let host = (infoCompany[0].ambiente === 'PRUEBA') ? 'https://celcer.sri.gob.ec' : 'https://cel.sri.gob.ec';

    let recibida;
    try {
      recibida = await this.facturaService.recepcionComprobantesOffline( nombreComercial, claveAcceso, retencion_id, 'retencion', host, pathXML, datosRetencion.user_id, xml, 'retencion' );
    } catch (error) {
      return { ok: false }
    }

    if( recibida ){
      // ---------------------- AUMENTAR EL SECUENCIAL RETENCION. -------------------
      const secuencial = claveAcceso.substring(30, 39);
      let option: any = {};

      if ( infoCompany[0].ambiente == 'PRUEBA' )
        option.secuencia_retencion_pruebas = parseInt( secuencial ) + 1;
      else
        option.secuencia_retencion_produccion = parseInt( secuencial ) + 1;

      this.sucursalRepository.update( datosRetencion.sucursal_id, option );
      // --------------------------------------------------------------------------

      setTimeout(async () => {
        let autorizado;
        try {
          autorizado = await this.facturaService.autorizacionComprobantesOffline( host, claveAcceso, retencion_id, datosRetencion.user_id, nombreComercial, 'retencion', '', 'retencion');
        } catch (error) {
          return { ok: false }
        }

        return { ok: true }
      }, 2500)
    }
  }

  async saveRetencionDB( datosRetencion, totalSinImpuestos, importeTotal, clave_acceso ) {

    var array_comprobante = clave_acceso.substring(24, 39);
    var parte1 = array_comprobante.substring(0, 3);
    var parte2 = array_comprobante.substring(3, 6);
    var parte3 = array_comprobante.substring(6);

    const numero_comprobante = parte1 + "-" + parte2 + "-" + parte3;

    let retencionEntity = new Retencion();
    retencionEntity = {
      sucursal_id:            datosRetencion.sucursal_id,
      user_id:                datosRetencion.user_id,
      customer_id:            datosRetencion.customer_id,
      clave_acceso,
      clave_acceso_sustento:  datosRetencion.clave_acceso,
      numero_comprobante,
      tipo_documento:         datosRetencion.tipo_documento,
      descripcion: '',
      fecha_emision_sustento: datosRetencion.inputDate,
      forma_pago: '',
      totalSinImpuestos,
      importeTotal: +importeTotal,
      respuestaSRI: '',
      estadoSRI:             'PENDIENTE'
    }

    const retencionCreated = await this.retencionRepository.save( retencionEntity );

    const pivot: Array<PivotRetencion> = [];
    datosRetencion.impuestos.forEach( impuesto => {
      pivot.push(new PivotRetencion(
        impuesto.tipo_impuesto,
        impuesto.codigo,
        impuesto.porcentaje_iva,
        impuesto.valor_retenido,
        impuesto.base_imponible,
        retencionCreated
      ));
    })

    await this.tablePivotRepository.save( pivot );

    return retencionCreated.id
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

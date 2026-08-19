import { User } from "src/auth/entities/user.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { Email } from "src/email/entities/email.entity";
import { Proforma } from "src/proforma/entities/proforma.entity";
import { Provider } from "src/providers/entities/provider.entity";
import { Sucursal } from "src/sucursal/entities/sucursal.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('companies')
export class Company {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => User, (user) => user.company)
    users: User[];

    @OneToMany(() => Provider, (provider) => provider.company)
    provider: Provider[]

    @OneToMany(() => Customer, (customer) => customer.company_id)
    customer: Customer[]

    @OneToMany(() => Sucursal, (sucursal) => sucursal.company_id )
    sucursal: Sucursal[]

    @OneToMany(() => Email, (email) => email.company_id )
    emails: Email[]

    @OneToMany(() => Proforma, (proforma) => proforma.company_id )
    proforma: Proforma[]

    @Column({ type: 'varchar', length: 255 })
    razon_social: string;

    @Column({ type: 'varchar', length: 255 })
    nombre_comercial: string;

    @Column({ type: 'varchar', length: 300 })
    direccion_matriz: string;

    @Column({ type: 'varchar', length: 13, unique: true })
    ruc: string;

    @Column({ type: 'varchar', length: 100 })
    email: string;

    @Column({ type: 'varchar', default: 15, nullable: true })
    telefono: string;

    @Column({ type: 'char', nullable: true })
    iva: string;

    @Column({ type: 'text', nullable: true })
    logo?: string;

    @Column({ type: 'bool' })
    obligado_contabilidad: boolean;

    @Column({ type: 'varchar', length: 300 })
    clave_certificado: string;

    @Column({ type: 'varchar', length: 75, nullable: true })
    provincia: string;

    @Column({ type: 'varchar', length: 75, nullable: true })
    ciudad: string;

    @Column({ type: 'varchar', default: null })
    archivo_certificado: string;

    @Column({ type: 'varchar', default: null })
    fecha_caducidad_certificado: string;

    /**
     * Número de la sesión de WhatsApp vinculada. Va aparte de `telefono`, que es
     * el de contacto de la empresa y se escribe a mano.
     */
    @Column({ type: 'varchar', length: 20, nullable: true })
    numero_whatsApp?: string;

    /** Si está apagado no se intenta enviar nada por WhatsApp. */
    @Column({ type: 'bool', default: true })
    whatsapp_activo?: boolean;

    /** Canal por el que salen los WhatsApp: 'baileys' (QR) o 'cloud_api' (oficial). */
    @Column({ type: 'varchar', length: 20, default: 'baileys' })
    wa_provider?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    wa_cloud_phone_number_id?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    wa_cloud_waba_id?: string;

    /**
     * Token de Meta. Es un secreto y va con `select: false` porque hay consultas
     * que devuelven la empresa completa al navegador (el listado de ventas trae
     * `sucursal_id.company_id` sin filtrar campos). Quien lo necesite tiene que
     * pedirlo explícitamente con addSelect: hoy solo CloudApiService.
     */
    @Column({ type: 'text', nullable: true, select: false })
    wa_cloud_access_token?: string;

    /**
     * Nombres de las plantillas aprobadas en Meta. El canal oficial no permite
     * escribir libremente: un envío que el cliente no pidió tiene que ir con una
     * plantilla aprobada, y cada tipo de comprobante usa la suya.
     */
    @Column({ type: 'varchar', length: 100, nullable: true })
    wa_cloud_template_factura?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    wa_cloud_template_proforma?: string;

    @Column({ type: 'varchar', length: 10, default: 'es' })
    wa_cloud_template_idioma?: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

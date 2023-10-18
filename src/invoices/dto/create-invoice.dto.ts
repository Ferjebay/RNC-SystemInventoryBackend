import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MinLength } from "class-validator";
import { User } from "src/auth/entities/user.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { Product } from "src/products/entities/product.entity";
import { InvoiceToProduct } from '../entities/invoiceToProduct.entity';

export class CreateInvoiceDto {

    @IsUUID()
    customer_id: Customer;

    @IsUUID()
    user_id: User;

    @IsArray()
    @ArrayNotEmpty()
    products: any[];

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    numero_comprobante: string;

    @IsNumber()
    subtotal: number;

    @IsNumber()
    descuento: number;

    @IsNumber()
    iva: number;

    @IsNumber()
    total: number;

    @IsOptional()
    estadoSRI?: string;

    @IsOptional()
    respuestaSRI?: string;

}

import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsNumber, IsString, IsUUID, MinLength } from "class-validator";
import { User } from "src/auth/entities/user.entity";
import { Product } from "src/products/entities/product.entity";
import { Provider } from "src/providers/entities/provider.entity";

export class CreateBuyDto {

    @IsUUID()
    proveedor_id: Provider;

    @IsUUID()
    user_id: User;

    @IsArray()
    @ArrayNotEmpty()
    products: any[]

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    numero_comprobante: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    descripcion: string;

    @IsNumber()
    subtotal: number;

    @IsNumber()
    descuento: number;

    @IsNumber()
    iva: number;

    @IsNumber()
    total: number

    @IsString()
    fecha_compra: string;
}

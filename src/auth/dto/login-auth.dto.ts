import { IsEmail, IsNotEmpty, IsString, ValidateIf, Validate } from "class-validator";
import { CpfValidator, CnpjValidator } from "../../common/validators/cpf-cnpj.validator";

export class LoginAuthDto {

    @IsEmail()
    @IsNotEmpty()
    @ValidateIf((o) => !o.username && !o.cpf && !o.cnpj) 
    email?: string;

    @IsNotEmpty()
    @Validate(CpfValidator)
    @ValidateIf((o) => !o.username && !o.email && !o.cnpj) 
    cpf?: string;

    @IsNotEmpty()
    @Validate(CnpjValidator)
    @ValidateIf((o) => !o.username && !o.email && !o.cpf) 
    cnpj?: string;

    @IsString()
    @IsNotEmpty()
    hashPassword: string;
}
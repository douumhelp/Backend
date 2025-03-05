import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { CnpjValidator } from "../../common/validators/cpf-cnpj.validator";


export class RegisterAuthPJDto {

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    hashPassword: string;

    @IsNotEmpty()
    @Validate(CnpjValidator)
    cnpj: string;

    @IsPhoneNumber("BR")
    @IsNotEmpty()
    telephone: string;

}
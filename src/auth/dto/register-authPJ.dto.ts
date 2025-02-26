import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { CnpjValidator } from "../../common/validators/cpf-cnpj.validator";


export class RegisterAuthPJDto {

    
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    //Mudar para @IsStrongPassword no futuro
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
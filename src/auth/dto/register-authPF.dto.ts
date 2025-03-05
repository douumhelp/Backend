import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { CpfValidator } from "../../common/validators/cpf-cnpj.validator";


export class RegisterAuthPFDto {

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
    @Validate(CpfValidator)
    cpf: string;

    @IsPhoneNumber("BR")
    @IsNotEmpty()
    telephone: string;
    
}
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { CpfValidator } from "../../common/validators/cpf-cnpj.validator";


export class RegisterAuthPFDto {

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
    @Validate(CpfValidator)
    cpf: string;

    @IsPhoneNumber("BR")
    @IsNotEmpty()
    telephone: string;
    
}
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'CpfValidator', async: false })
export class CpfValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return cpf.isValid(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'CPF inválido!';
  }
}

@ValidatorConstraint({ name: 'CnpjValidator', async: false })
export class CnpjValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return cnpj.isValid(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'CNPJ inválido!';
  }
}
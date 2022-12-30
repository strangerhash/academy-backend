import { IsString, IsEmail, IsBoolean, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public town: string;

  @IsString()
  public country: string;

  @IsString()
  public companyName: string;

  @IsString()
  public city: string;

  @IsString()
  public postalCode: string;

  @IsString()
  public phoneNumber: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  // @IsString()
  // public token: string;


  // @IsNumber()
  // public roleId: number;

  // @IsBoolean()
  // public account_verified: boolean;

  // @IsString()
  // public activation_code: string;





}

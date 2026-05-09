import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'khaiqal satrio' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'khaiqal@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'asd12345', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'khaiqal@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'asd12345' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class GoogleLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  idToken: string;
}

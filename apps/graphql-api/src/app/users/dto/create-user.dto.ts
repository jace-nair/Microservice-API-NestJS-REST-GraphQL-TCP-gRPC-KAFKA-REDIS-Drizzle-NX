import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password!: string;

  @Field()
  @IsEnum(['admin', 'user'], {
    message: 'valid role required',
  })
  role!: 'admin' | 'user';
}

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class LoginUserDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email!:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(8)
    password!:string;
}
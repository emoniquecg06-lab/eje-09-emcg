import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './auth/auth.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //ruta no protegida
  @ApiBody({type:CreateUserDto})
  @ApiCreatedResponse({type:User, description: "Creado correctamente"})
  @ApiBadRequestResponse({description: "email no valido o contraseña con longitud menor a 8."})
  @ApiConflictResponse({description:"Correo duplicado"})
  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  //Ruta no protegida
  @ApiBody({type:LoginUserDto})
  @ApiCreatedResponse({
    description:"Acceso correcto",
    schema:{
      example:"Token generado con jwt"
    }
  })
  @ApiNotFoundResponse({description:"No existe el usuario"})
  @ApiUnauthorizedResponse({description:"Contraseña incorrecta"})
  @Post('/login')
  login(@Body() loginUserDto:LoginUserDto){
    return this.authService.loginUser(loginUserDto);
  }

  //Ruta o End Point protegido que requiere un tojen
  //Para ver el perfil de usuario se requiere un token
  //EL guard crea el objeto user y lo anexa a la solicitud
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/profile')
  profile (@Request() req){
    return "Estas viendo un perfil protegido pro un Token valido del usuario" + req.user
  }
}
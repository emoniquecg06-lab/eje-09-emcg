import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto) {
    const emailExiste = await this.findOneByEmail(createUserDto.email);
    if (!emailExiste) {
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashPassword;
      const user = this.usersRepository.create(createUserDto);
      return this.usersRepository.save(user);
    } else {
      throw new BadRequestException({
        message: ['Usuario duplicado'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }
  }

  async generateToken(userId: number) {
    const accesToken = this.jwtService.sign({ userId });
    return { accesToken };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException({
        message: ['Usuario no encontrado'],
        error: 'No autorizado',
        statusCode: 403,
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException({
        message: ['Clave incorrecta'],
        error: 'No autorizado',
        statusCode: 403,
      });
    }
    return this.generateToken(user.id);
  }
}

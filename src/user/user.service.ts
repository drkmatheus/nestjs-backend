import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async findByOrFail(userData: Partial<User>) {
    const user = await this.userRespository.findOneBy(userData);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async failIfEmailExists(email: string) {
    const existentEmail = await this.userRespository.exists({
      where: {
        email,
      },
    });

    if (existentEmail) {
      throw new ConflictException('Email já cadastrado no sistema');
    }
  }

  async create(dto: CreateUserDto) {
    await this.failIfEmailExists(dto.email);

    const hashedPassword = await this.hashingService.hash(dto.password);
    const newUser: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };

    const create = this.userRespository.save(newUser);
    return create;
  }

  findByEmail(email: string) {
    return this.userRespository.findOneBy({ email });
  }

  findById(id: string) {
    return this.userRespository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateUserDto) {
    if (!dto.name && !dto.email) {
      throw new BadRequestException('Dados inválidos');
    }

    const user = await this.findByOrFail({ id });

    user.name = dto.name ?? user.name;

    if (dto.email && dto.email !== user.email) {
      await this.failIfEmailExists(dto.email);
      user.email = dto.email;
      user.forceLogout = true;
    }

    return this.save(user);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.findByOrFail({ id });

    const currentPassword = await this.hashingService.compare(
      dto.currentPassword,
      user.password,
    );

    if (!currentPassword) {
      throw new UnauthorizedException('Senha atual inválida');
    }

    user.password = await this.hashingService.hash(dto.newPassword);
    user.forceLogout = true;

    return this.save(user);
  }

  async remove(id: string) {
    const user = await this.findByOrFail({ id });
    await this.userRespository.delete({ id });
    return user;
  }

  save(user: User) {
    return this.userRespository.save(user);
  }
}

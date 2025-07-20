import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(dto: CreateUserDto) {
    const existentEmail = await this.userRespository.exists({
      where: {
        email: dto.email,
      },
    });

    if (existentEmail) {
      throw new ConflictException('Email já cadastrado no sistema');
    }

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

  save(user: User) {
    return this.userRespository.save(user);
  }
}

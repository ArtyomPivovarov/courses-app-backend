import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { IUserProfile } from '@/types/user.types'
import { createAccessToken } from '@/utils/auth.utils'
import { buildUserProfile } from '@/utils/user.utils'
import { validate } from 'class-validator'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(
    createUserDto: CreateUserDto
  ): Promise<{ user: IUserProfile; accessToken: string }> {
    const existUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    })
    if (existUser) {
      throw new BadRequestException('User already exists')
    }

    const user = await this.userRepository.save({
      email: createUserDto.email,
      name: createUserDto.name,
      passwordHash: await bcrypt.hash(
        createUserDto.password,
        await bcrypt.genSalt()
      )
    })

    return {
      user: buildUserProfile(user),
      accessToken: createAccessToken(user.id, user.email, this.jwtService)
    }
  }

  async findOne(email: string) {
    return this.userRepository.findOne({ where: { email } })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const errors = await validate(updateUserDto, {
      whitelist: true,
      forbidNonWhitelisted: true
    })
    if (errors.length) {
      throw new BadRequestException(
        errors.map(e => e.constraints.whitelistValidation)
      )
    }

    await this.userRepository.update(id, updateUserDto)
  }

  async getProfile(id: number) {
    return buildUserProfile(
      await this.userRepository.findOne({ where: { id } })
    )
  }
}

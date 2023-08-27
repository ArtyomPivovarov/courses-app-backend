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
import { UserProfile } from '@/user/user.types'
import { createAccessToken } from '@/auth/auth.utils'
import { buildUserProfile } from '@/user/user.utils'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(
    createUserDto: CreateUserDto
  ): Promise<{ user: UserProfile; accessToken: string }> {
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
      accessToken: createAccessToken(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        this.jwtService
      )
    }
  }

  async findOne(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: {
        transactions: true,
        purchases: true
      }
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return await this.userRepository.update(id, updateUserDto)
  }

  async getProfile(id: number) {
    return buildUserProfile(
      await this.userRepository.findOne({
        select: {
          id: true,
          email: true,
          name: true,
          transactions: true,
          purchases: {
            id: true,
            product: {
              id: true,
              slug: true,
              nameEn: true,
              nameRu: true
            }
          }
        },
        where: { id },
        relations: {
          transactions: true,
          purchases: {
            product: true
          }
        }
      })
    )
  }
}

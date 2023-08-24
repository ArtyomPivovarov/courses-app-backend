import { BadRequestException, Injectable } from '@nestjs/common'
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
    const userProfile = buildUserProfile(user)

    return {
      user: userProfile,
      accessToken: createAccessToken(userProfile, this.jwtService)
    }
  }

  async findAll() {
    return this.userRepository.find()
  }

  async findOne(email: string) {
    return this.userRepository.findOne({ where: { email } })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto)
    return this.userRepository.findOne({ where: { id } })
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id)
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { FullUserProfile } from '@/user/user.types'
import { buildFullUserProfile, buildUserProfile } from '@/user/user.utils'
import { UpdateUserProfileDto } from '@/user/dto/update-user-profile.dto'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { PaginatedResponse } from '@/common/types/pagination.types'
import { RegisterUserDto } from '@/user/dto/register-user.dto'
import { CreateUserDto } from '@/user/dto/create-user.dto'
import { SuccessAuthResponse } from '@/auth/auth.types'
import { AuthService } from '@/auth/auth.service'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class UserService {
  private authService: AuthService
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly authModuleRef: ModuleRef
  ) {}

  onModuleInit() {
    this.authService = this.authModuleRef.get(AuthService, { strict: false })
  }

  async create(createUserDto: CreateUserDto) {
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
      ),
      role: createUserDto.role
    })

    return buildFullUserProfile(user)
  }

  async register(
    registerUserDto: RegisterUserDto
  ): Promise<SuccessAuthResponse> {
    const existUser = await this.userRepository.findOne({
      where: { email: registerUserDto.email }
    })
    if (existUser) {
      throw new BadRequestException('User already exists')
    }

    const user = await this.userRepository.save({
      email: registerUserDto.email,
      name: registerUserDto.name,
      passwordHash: await bcrypt.hash(
        registerUserDto.password,
        await bcrypt.genSalt()
      )
    })

    return {
      user: buildUserProfile(user),
      accessToken: this.authService.generateAccessToken(user),
      refreshToken: await this.authService.generateRefreshToken(user)
    }
  }

  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponse<FullUserProfile>> {
    const { page, limit } = paginationQuery

    const [items, totalItems] = await this.userRepository.findAndCount({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      },
      skip: (page - 1) * limit,
      take: limit
    })

    return {
      items,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    }
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id }
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async findOneByEmail(email: string) {
    const user = this.userRepository.findOne({
      where: { email }
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async getFullUserProfileById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id }
    })

    return buildFullUserProfile(user)
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id)

    const { password, ...rest } = updateUserDto
    const updateUserPayload = { ...rest }
    if (password) {
      updateUserPayload['passwordHash'] = await bcrypt.hash(
        password,
        await bcrypt.genSalt()
      )
    }

    return await this.userRepository.update(user.id, updateUserPayload)
  }

  async getProfile(id: number) {
    return buildUserProfile(
      await this.userRepository.findOne({
        select: {
          id: true,
          email: true,
          name: true
        },
        where: { id }
      })
    )
  }

  async updateProfile(id: number, updateUserProfile: UpdateUserProfileDto) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return await this.userRepository.update(id, updateUserProfile)
  }
}

import { faker } from '@faker-js/faker'
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma.service'
import { LoginUserDto } from './dto/login.dto'
import { CreateUserDto } from './dto/register.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService
	) {}

	private async hashPassword(password: string, salt: number) {
		const hashedPassword = await bcrypt.hash(password, salt)
		return hashedPassword
	}

	async register(createUserDto: CreateUserDto) {
		const existUser = await this.prismaService.user.findUnique({
			where: { email: createUserDto.email }
		})

		if (existUser)
			throw new BadRequestException('User with this email already exists!')

		const hashedPassword = await this.hashPassword(createUserDto.password, 10)

		const user = await this.prismaService.user.create({
			data: {
				email: createUserDto.email,
				password: hashedPassword,
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName()
			}
		})

		const tokens = this.getTokens(user.id)

		return { user: this.getUser(user), ...tokens }
	}

	private async getTokens(userId: number) {
		const accessToken = this.jwtService.sign(
			{ id: userId },
			{
				expiresIn: '1h'
			}
		)

		const refreshToken = this.jwtService.sign(
			{ id: userId },
			{
				expiresIn: '24h'
			}
		)

		return { accessToken, refreshToken }
	}

	private getUser(user: User) {
		return {
			id: user.id,
			email: user.email
		}
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwtService.verifyAsync(refreshToken)

		if (!result) throw new UnauthorizedException('Invalid refresh token!')

		const user = await this.prismaService.user.findUnique({
			where: {
				id: result.id
			}
		})

		const tokens = await this.getTokens(user.id)

		return { user: this.getUser(user), ...tokens }
	}

	async login(loginUserDto: LoginUserDto) {
		const user = await this.validate(loginUserDto)
		const tokens = await this.getTokens(user.id)

		return { user: this.getUser(user), ...tokens }
	}

	private async validate(loginUserDto: LoginUserDto) {
		const validateUser = await this.prismaService.user.findUnique({
			where: {
				email: loginUserDto.email
			}
		})

		if (!validateUser) throw new NotFoundException('User not found!')

		const isValidPassword = await bcrypt.compare(
			loginUserDto.password,
			validateUser.password
		)

		if (!isValidPassword) throw new UnauthorizedException('Invalid password!')

		return validateUser
	}
}

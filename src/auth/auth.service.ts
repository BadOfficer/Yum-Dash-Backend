import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { LoginUserDto } from './dto/login.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UsersService
	) {}

	async register(dto: CreateUserDto) {
		const user = await this.userService.create(dto)

		const tokens = this.getTokens(user.id)

		return { user, ...tokens }
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

	async getNewTokens(refreshToken: string) {
		const result = await this.jwtService.verifyAsync(refreshToken)

		if (!result) throw new UnauthorizedException('Invalid refresh token!')

		const user = await this.userService.getUserById(result.id)

		const tokens = await this.getTokens(user.id)

		return { user, ...tokens }
	}

	async login(loginUserDto: LoginUserDto) {
		const user = await this.validate(loginUserDto)
		const tokens = await this.getTokens(user.id)

		return { user, ...tokens }
	}

	private async validate(dto: LoginUserDto) {
		const validateUser = await this.userService.getUserByEmail(dto.email)

		if (!validateUser) throw new NotFoundException('User not found!')

		// const isValidPassword = await bcrypt.compare(
		// 	dto.password,
		// 	validateUser.password
		// )

		// if (!isValidPassword) throw new UnauthorizedException('Invalid password!')

		return validateUser
	}
}

import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginUserDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { CreateUserDto } from './dto/register.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/login')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async login(@Body() loginUserDto: LoginUserDto) {
		return await this.authService.login(loginUserDto)
	}

	@Post('/login/access-token')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async accessToken(@Body() refreshTokenDto: RefreshTokenDto) {
		return await this.authService.getNewTokens(refreshTokenDto.refreshToken)
	}

	@Post('/register')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async register(@Body() createUserDto: CreateUserDto) {
		return await this.authService.register(createUserDto)
	}
}

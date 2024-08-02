import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { ChangeUserRoleDto } from './dto/change-role.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('/profile')
	@UseGuards(JwtGuard)
	@HttpCode(200)
	async getProfile(@CurrentUser('id') id: number) {
		return this.usersService.getUserById(id)
	}

	@Put('/profile')
	@UseGuards(JwtGuard)
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async updateUser(
		@CurrentUser('id') id: number,
		@Body() updateUserDto: UpdateUserDto
	) {
		return this.usersService.updateUser(id, updateUserDto)
	}

	@Get()
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@HttpCode(200)
	async getUsers() {
		return this.usersService.getAllUsers()
	}

	@Delete(':id')
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@HttpCode(200)
	async deleteUser(@Param('id') id: string) {
		return this.usersService.deleteUserAccount(+id)
	}

	@Patch()
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@HttpCode(200)
	async changeUserRole(@Body() changeRoleDto: ChangeUserRoleDto) {
		return this.usersService.changeUserRole(changeRoleDto)
	}
}

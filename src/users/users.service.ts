import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma.service'
import { ChangeUserRoleDto } from './dto/change-role.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}

	async getUserById(userId: number) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				phone: true,
				address: true,
				password: false,
				avatarPath: true,
				role: true,
				email: true
			}
		})

		if (!user) throw new NotFoundException('User not found!')

		return user
	}

	async updateUser(userId: number, updateUserDto: UpdateUserDto) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		})
		const confirmedPassword = await bcrypt.compare(
			updateUserDto.oldPassword,
			user.password
		)

		if (!confirmedPassword)
			throw new BadRequestException('Password not confirmed!')

		return await this.prismaService.user.update({
			where: {
				id: userId
			},
			data: {
				email: user.email,
				address: updateUserDto.address,
				firstName: updateUserDto.firstName,
				lastName: updateUserDto.lastName,
				avatarPath: updateUserDto.avatarPath,
				phone: updateUserDto.phone,
				password: updateUserDto.newPassword
					? await bcrypt.hash(updateUserDto.newPassword, 10)
					: user.password
			},
			omit: {
				password: true
			}
		})
	}

	async getAllUsers() {
		return await this.prismaService.user.findMany({
			omit: {
				password: true
			}
		})
	}

	async deleteUserAccount(userId: number) {
		const existingUser = await this.getUserById(userId)

		if (!existingUser) throw new BadRequestException('User not found!')

		await this.prismaService.user.delete({
			where: {
				id: userId
			}
		})

		return `User - ${existingUser.firstName} ${existingUser.lastName} has been deleted!`
	}

	async changeUserRole(changeRoleDto: ChangeUserRoleDto) {
		const existingUser = await this.getUserById(changeRoleDto.id)

		if (!existingUser) throw new BadRequestException('User not found!')

		return await this.prismaService.user.update({
			where: {
				id: existingUser.id
			},
			data: {
				role: changeRoleDto.role
			}
		})
	}
}

import { Role } from '@prisma/client'
import { IsString } from 'class-validator'

export class ChangeUserRoleDto {
	@IsString()
	id: number

	@IsString()
	role: Role
}

import { applyDecorators, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'
import { JwtGuard } from '../guards/jwt.guard'
import { RolesGuard } from '../guards/roles.guard'
import { Roles } from './roles.decorator'

export const Auth = (role: Role = Role.USER) => {
	return applyDecorators(
		role === Role.USER ? UseGuards(JwtGuard) : UseGuards(JwtGuard, RolesGuard),
		Roles(role)
	)
}

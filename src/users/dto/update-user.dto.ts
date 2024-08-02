import { IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	firstName: string

	@IsString()
	@IsOptional()
	lastName: string

	@IsString()
	@IsOptional()
	newPassword: string

	oldPassword: string

	@IsString()
	@IsOptional()
	phone: string

	@IsString()
	@IsOptional()
	address: string

	@IsString()
	@IsOptional()
	avatarPath: string
}

import { IsEmail, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
	@IsString()
	firstName: string

	@IsString()
	lastName: string

	@IsEmail()
	email: string

	@IsString()
	@MinLength(8, {
		message: 'The password must contain at least 8 characters'
	})
	password: string
}

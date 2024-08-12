import { IsOptional, IsString } from 'class-validator'

export class CategoryDto {
	@IsOptional()
	id?: number

	@IsString()
	title: string
}

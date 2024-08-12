import { IsOptional, IsString } from 'class-validator'

export class IngradientDto {
	@IsOptional()
	id?: number

	@IsString()
	name: string
}

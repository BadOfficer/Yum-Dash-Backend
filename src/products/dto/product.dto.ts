import { IsArray, IsNumber, IsString } from 'class-validator'

export class ProductDto {
	@IsString()
	title: string

	@IsNumber()
	price: number

	@IsString()
	image: string

	@IsString()
	description: string

	@IsNumber()
	categoryId: number

	@IsArray()
	@IsString({ each: true })
	ingradients: string[]
}

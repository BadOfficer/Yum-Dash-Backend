import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'

export class ReviewsDto {
	@IsNotEmpty({ message: "Text can't be empty!" })
	@IsString({ message: 'Text must be string!' })
	text: string

	@IsNumber({}, { message: 'Rating must be number!' })
	@Min(1, { message: 'Minimum rating is 1!' })
	@Max(5, { message: 'Maximum rating is 5!' })
	@IsNotEmpty({ message: "Rating can't be empty!" })
	rating: number
}

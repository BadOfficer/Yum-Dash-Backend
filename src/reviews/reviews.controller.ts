import {
	Body,
	Controller,
	Delete,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ReviewsDto } from './dto/reviews.dto'
import { ReviewsService } from './reviews.service'

@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

	@Post(':productId')
	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	async create(
		@Body() dto: ReviewsDto,
		@CurrentUser('id') userId: number,
		@Param('productId') productId: string
	) {
		return await this.reviewsService.createReview(dto, userId, +productId)
	}

	@Auth(Role.ADMIN)
	@Delete(':id')
	async delete(@CurrentUser('id') userId: number, @Param('id') id: string) {
		return await this.reviewsService.deleteReview(+id, userId)
	}
}

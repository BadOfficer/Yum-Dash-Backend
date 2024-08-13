import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductsService } from 'src/products/products.service'
import { ReviewsDto } from './dto/reviews.dto'
import { returnReviewObject } from './return-review.object'

@Injectable()
export class ReviewsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly productsService: ProductsService
	) {}

	async getReviewById(reviewId: number, userId: number) {
		const review = await this.prismaService.review.findUnique({
			where: {
				id: reviewId,
				userId: userId
			},
			include: {
				user: true
			}
		})

		if (!review) throw new NotFoundException('Review not found!')

		return review
	}

	async createReview(dto: ReviewsDto, userId: number, productId: number) {
		await this.productsService.getProductById(productId)

		const review = await this.prismaService.review.create({
			data: {
				text: dto.text,
				rating: dto.rating,
				product: {
					connect: {
						id: productId
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			},
			select: returnReviewObject
		})

		return review
	}

	async deleteReview(id: number, userId: number) {
		const review = await this.getReviewById(id, userId)

		await this.prismaService.review.delete({
			where: {
				id
			}
		})

		return `Review - ${review.id} has been deleted!`
	}
}

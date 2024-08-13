import { Prisma } from '@prisma/client'
import { returnCategoryObject } from 'src/categories/return-category.object'
import { returnIngradientObject } from 'src/ingradients/return-ingradient.object'
import { returnReviewObject } from 'src/reviews/return-review.object'

export const returnProductObject: Prisma.ProductSelect = {
	id: true,
	title: true,
	description: true,
	image: true,
	price: true,
	reviews: {
		select: {
			...returnReviewObject,
			user: {
				select: {
					firstName: true,
					lastName: true,
					avatarPath: true
				}
			}
		}
	},
	slug: true,
	category: {
		select: returnCategoryObject
	},
	ingradients: {
		select: {
			ingradient: {
				select: returnIngradientObject
			}
		}
	}
}

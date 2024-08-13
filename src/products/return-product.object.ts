import { Prisma } from '@prisma/client'
import { returnCategoryObject } from 'src/categories/return-category.object'
import { returnIngradientObject } from 'src/ingradients/return-ingradient.object'

export const returnProductObject: Prisma.ProductSelect = {
	id: true,
	title: true,
	description: true,
	image: true,
	price: true,
	reviews: true,
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

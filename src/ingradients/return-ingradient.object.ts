import { Prisma } from '@prisma/client'

export const returnIngradientObject: Prisma.IngradientSelect = {
	id: true,
	name: true
}

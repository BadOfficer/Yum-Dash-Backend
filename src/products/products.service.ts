import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductDto } from './dto/product.dto'
import { returnProductObject } from './return-product.object'

@Injectable()
export class ProductsService {
	constructor(private readonly prismaService: PrismaService) {}

	async getProductById(productId: number) {
		const product = await this.prismaService.product.findUnique({
			where: {
				id: productId
			},
			select: returnProductObject
		})

		if (!product) throw new NotFoundException('Product not found!')

		return product
	}

	async getProductByTitle(title: string) {
		const product = await this.prismaService.product.findFirst({
			where: {
				title: title
			},
			select: returnProductObject
		})

		if (!product) throw new NotFoundException('Product not found!')

		return product
	}

	async getAll(offset: number, count: number) {
		return await this.prismaService.product.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			skip: count * (offset - 1),
			take: count,
			select: returnProductObject
		})
	}

	async getBySearch(searchOption: string) {
		return await this.prismaService.product.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			take: 5,
			where: {
				title: {
					contains: searchOption,
					mode: 'insensitive'
				}
			},
			select: {
				title: true,
				image: true
			}
		})
	}

	async getProductByCategory(categoryId: number) {
		const products = await this.prismaService.product.findMany({
			where: {
				category: {
					id: categoryId
				}
			},
			select: returnProductObject
		})

		return products
	}

	async createProduct(dto: ProductDto) {
		const product = await this.prismaService.product.create({
			data: {
				title: dto.title,
				image: dto.image,
				description: dto.description,
				price: +dto.price,
				category: {
					connect: {
						id: +dto.categoryId
					}
				},
				ingradients: {
					create: dto.ingradients.map(ingradientId => ({
						ingradient: {
							connect: {
								id: +ingradientId
							}
						}
					}))
				}
			}
		})

		return product
	}

	async updateProduct(dto: ProductDto, productId: number) {
		const product = await this.prismaService.product.findUnique({
			where: {
				id: productId
			}
		})

		if (!product) throw new NotFoundException('Product not found!')

		await this.prismaService.product.update({
			where: { id: productId },
			data: {
				title: dto.title,
				image: dto.image,
				description: dto.description,
				price: +dto.price,
				category: {
					connect: {
						id: +dto.categoryId
					}
				},
				ingradients: {
					deleteMany: {},
					create: dto.ingradients.map(ingradientId => ({
						ingradient: {
							connect: {
								id: +ingradientId
							}
						}
					}))
				}
			}
		})

		return `Product - ${product.title} has been updated!`
	}

	async deleteProduct(productId: number) {
		const product = await this.prismaService.product.findUnique({
			where: {
				id: productId
			},
			select: returnProductObject
		})

		if (!product) throw new NotFoundException('Product not found!')

		await this.prismaService.product.delete({
			where: {
				id: productId
			}
		})

		return `Product - ${product.title} has been deleted!`
	}
}

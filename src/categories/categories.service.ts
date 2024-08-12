import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CategoryDto } from './dto/category.dto'

@Injectable()
export class CategoriesService {
	constructor(private readonly prismaService: PrismaService) {}

	async createCategory(dto: CategoryDto) {
		const existCategory = await this.prismaService.category.findUnique({
			where: {
				title: dto.title
			}
		})

		if (existCategory) throw new BadRequestException('Category is exist!')

		return await this.prismaService.category.create({
			data: {
				title: dto.title
			}
		})
	}

	async getCategoryById(id: number) {
		const category = await this.prismaService.category.findUnique({
			where: {
				id
			}
		})

		if (!category) throw new NotFoundException('Category not found!')

		return category
	}

	async getCategoryByTitle(title: string) {
		const category = await this.prismaService.category.findUnique({
			where: {
				title: title
			}
		})

		if (!category) throw new NotFoundException('Category not found!')

		return category
	}

	async getAllCategories(
		searchOption: string = '',
		offset: number = 1,
		count: number = 10
	) {
		const validOffset = isNaN(offset) ? 1 : offset
		const validCount = isNaN(count) ? 10 : count

		return await this.prismaService.category.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			where: {
				title: {
					contains: searchOption,
					mode: 'insensitive'
				}
			},
			skip: validCount * (validOffset - 1),
			take: validCount
		})
	}

	async updateCategory(dto: CategoryDto) {
		const existCategory = await this.getCategoryById(dto.id)

		if (!existCategory) return

		return await this.prismaService.category.update({
			where: {
				id: dto.id
			},
			data: { title: dto.title }
		})
	}

	async deleteCategory(id: number) {
		const existCategory = await this.getCategoryById(id)

		if (!existCategory) return

		await this.prismaService.category.delete({
			where: {
				id
			}
		})

		return `Category ${existCategory.title} has been deleted!`
	}
}

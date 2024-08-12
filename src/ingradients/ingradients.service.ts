import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { IngradientDto } from './dto/ingradient.dto'

@Injectable()
export class IngradientsService {
	constructor(private readonly prismaService: PrismaService) {}

	async getIngradientById(id: number) {
		const ingradient = await this.prismaService.ingradient.findUnique({
			where: {
				id
			}
		})

		if (!ingradient) throw new NotFoundException('Ingradient not found!')

		return ingradient
	}

	async getIngradientByName(name: string) {
		const ingradient = await this.prismaService.ingradient.findUnique({
			where: {
				name
			}
		})

		if (!ingradient) throw new NotFoundException('Ingradient not found!')

		return ingradient
	}

	async getAllIngradients(
		searchOption: string = '',
		offset: number = 1,
		count: number = 10
	) {
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
			skip: count * (offset - 1),
			take: count
		})
	}

	async createIngradient(dto: IngradientDto) {
		const existIngradient = await this.getIngradientByName(dto.name)

		if (existIngradient) throw new BadRequestException('Ingradient is exist!')

		return await this.prismaService.ingradient.create({
			data: {
				...dto
			}
		})
	}

	async updateIngradient(dto: IngradientDto) {
		const existIngradient = await this.getIngradientById(dto.id)

		if (!existIngradient) throw new NotFoundException('Ingradient not found!')

		return await this.prismaService.ingradient.update({
			where: {
				id: dto.id
			},
			data: {
				...dto
			}
		})
	}

	async deleteIngradient(id: number) {
		const existIngradient = await this.getIngradientById(id)

		if (!existIngradient) throw new NotFoundException('Ingradient not found!')

		await this.prismaService.ingradient.delete({
			where: {
				id
			}
		})

		return `Ingradient ${existIngradient.name} has been deleted!`
	}
}

import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CategoriesService } from './categories.service'
import { CategoryDto } from './dto/category.dto'

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Post('create')
	@HttpCode(200)
	@Auth(Role.ADMIN)
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: CategoryDto) {
		return await this.categoriesService.createCategory(dto)
	}

	@Put()
	@HttpCode(200)
	@Auth(Role.ADMIN)
	@UsePipes(new ValidationPipe())
	async update(@Body() dto: CategoryDto) {
		return await this.categoriesService.updateCategory(dto)
	}

	@Delete(':id')
	@Auth(Role.ADMIN)
	@UsePipes(new ValidationPipe())
	async delete(@Param('id') id: string) {
		return await this.categoriesService.deleteCategory(+id)
	}

	@Auth(Role.ADMIN)
	@Get()
	async getAll(
		@Query('searchOption') searchOption?: string,
		@Query('offset') offset?: string,
		@Query('count') count?: string
	) {
		return await this.categoriesService.getAllCategories(
			searchOption,
			+offset,
			+count
		)
	}
}

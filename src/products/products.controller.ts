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
import { ProductDto } from './dto/product.dto'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	@HttpCode(200)
	@Auth(Role.ADMIN)
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: ProductDto) {
		return await this.productsService.createProduct(dto)
	}

	@Put(':id')
	@HttpCode(200)
	@Auth(Role.ADMIN)
	@UsePipes(new ValidationPipe())
	async update(@Body() dto: ProductDto, @Param('id') id: string) {
		return await this.productsService.updateProduct(dto, +id)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth(Role.ADMIN)
	async delete(@Param('id') id: string) {
		return await this.productsService.deleteProduct(+id)
	}

	@Get('product/:id')
	async getById(@Param('id') id: string) {
		return await this.productsService.getProductById(+id)
	}

	@Get('search/:query')
	async getBySearch(@Param('query') query: string) {
		return await this.productsService.getBySearch(query)
	}

	@Get('category/:id')
	async getByCategory(@Param('id') id: string) {
		return await this.productsService.getProductByCategory(+id)
	}

	@Get('get-all')
	async getAll(
		@Query('offset') offset: string = '1',
		@Query('count') count: string = '10'
	) {
		return await this.productsService.getAll(+offset, +count)
	}
}

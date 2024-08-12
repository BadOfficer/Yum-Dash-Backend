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
import { IngradientDto } from './dto/ingradient.dto'
import { IngradientsService } from './ingradients.service'

@Controller('ingradients')
export class IngradientsController {
	constructor(private readonly ingradientsService: IngradientsService) {}

	@Post()
	@HttpCode(200)
	@Auth(Role.ADMIN)
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: IngradientDto) {
		return await this.ingradientsService.createIngradient(dto)
	}

	@Put()
	@HttpCode(200)
	@Auth(Role.ADMIN)
	@UsePipes(new ValidationPipe())
	async update(@Body() dto: IngradientDto) {
		return await this.ingradientsService.updateIngradient(dto)
	}

	@Delete(':id')
	@Auth(Role.ADMIN)
	@UsePipes(new ValidationPipe())
	async delete(@Param('id') id: string) {
		return await this.ingradientsService.deleteIngradient(+id)
	}

	@Auth(Role.ADMIN)
	@Get()
	async getAll(
		@Query('searchOption') searchOption?: string,
		@Query('offset') offset?: string,
		@Query('count') count?: string
	) {
		return await this.ingradientsService.getAllIngradients(
			searchOption,
			+offset,
			+count
		)
	}
}

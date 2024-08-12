import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFiles,
	UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Role } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { FilesService } from './files.service'

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@HttpCode(200)
	@UseInterceptors(FilesInterceptor('files'))
	@Auth(Role.ADMIN)
	@Post()
	async saveFiles(
		@UploadedFiles() files: Express.Multer.File[],
		@Query('folder') folder?: string
	) {
		return this.filesService.saveFiles(files, folder)
	}
}

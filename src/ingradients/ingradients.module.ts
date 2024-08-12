import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { IngradientsController } from './ingradients.controller'
import { IngradientsService } from './ingradients.service'

@Module({
	controllers: [IngradientsController],
	providers: [IngradientsService, PrismaService]
})
export class IngradientsModule {}

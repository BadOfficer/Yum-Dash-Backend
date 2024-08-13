import { Module } from '@nestjs/common'
import { IngradientsModule } from 'src/ingradients/ingradients.module'
import { PrismaService } from 'src/prisma.service'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'

@Module({
	imports: [IngradientsModule],
	controllers: [ProductsController],
	providers: [ProductsService, PrismaService],
	exports: [ProductsService]
})
export class ProductsModule {}

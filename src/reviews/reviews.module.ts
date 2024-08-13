import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductsService } from 'src/products/products.service'
import { ReviewsController } from './reviews.controller'
import { ReviewsService } from './reviews.service'

@Module({
	controllers: [ReviewsController],
	providers: [ReviewsService, PrismaService, ProductsService]
})
export class ReviewsModule {}

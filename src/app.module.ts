import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import { ProductsModule } from './products/products.module';
import { IngradientsModule } from './ingradients/ingradients.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
	imports: [AuthModule, ConfigModule.forRoot(), UsersModule, CategoriesModule, FilesModule, ProductsModule, IngradientsModule, ReviewsModule]
})
export class AppModule {}

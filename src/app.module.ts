import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { CategoriesModule } from './categories/categories.module';

@Module({
	imports: [AuthModule, ConfigModule.forRoot(), UsersModule, CategoriesModule]
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from './upload/upload.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (process.env.DB_TYPE === 'better-sqlite3') {
          return {
            type: 'better-sqlite3',
            database: process.env.DB_DATABASE || './db.sqlite3',
            synchronize: process.env.DB_SYNCHRONIZE === '1',
            autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === '1',
          };
        }

        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          synchronize: process.env.DB_SYNCHRONIZE === '1',
          autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === '1',
        };
      },
    }),
    UploadModule,
  ],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}

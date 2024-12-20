import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { TagsModule } from './tags/tags.module';
import { Post } from '@nestjs/common';
import { MetaOption } from './meta-options/meta-options.entity';

// @Module indicates the entry point of the module - do not allow the names of files make you think that's what makes them what they are
@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        entities: [User, Post, MetaOption],
        autoLoadEntities: false, //Only use in dev mode:
        synchronize: true,
        port: 5432,
        username: 'postgres',
        password: '$unflower2024!!JO',
        host: 'localhost',
        database: 'nestjs-blog',
      }),
    }),
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

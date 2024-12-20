import { Injectable, Body } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-posts.dto';
import { Repository } from 'typeorm';
import { Post } from '../posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-options.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    /**Inject postsRepository */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}
  /**Inject metaOptionsRepository */
  @InjectRepository(MetaOption)
  public readonly metaOptiopnsRepository: Repository<MetaOption>;
  /**Creating new posts */
  public async create(@Body() createPostDto: CreatePostDto) {
    let metaOptions = createPostDto.metaOptions
      ? this.metaOptiopnsRepository.create(createPostDto.metaOptions)
      : null;

    if (metaOptions) {
      await this.metaOptiopnsRepository.save(metaOptions);
    }
    // You only need to use 'await' when saving to the database
    let post = this.postsRepository.create(createPostDto);

    if (metaOptions) {
      post.metaOption = metaOptions;
    }
    return await this.postsRepository.save(post);
  }

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    // users service, find a user, if exists, find a post!
    return [
      {
        user: user,
        title: 'Test Tile',
        content: 'Test Content',
      },
      {
        user: user,
        title: 'Test Tile 2',
        content: 'Test Content 2',
      },
    ];
  }
}

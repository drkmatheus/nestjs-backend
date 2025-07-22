import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateSlug } from 'src/common/utils/create-slug';
import { NotFoundError } from 'rxjs';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findOnePostOrFail(postData: Partial<Post>) {
    const post = await this.findOnePost(postData);

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async findOnePostByAuthorOrFail(postData: Partial<Post>, author: User) {
    const post = await this.findOnePostByAuthor(postData, author);

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async findOnePostByAuthor(postData: Partial<Post>, author: User) {
    const post = await this.postRepository.findOne({
      where: {
        ...postData,
        author: { id: author.id },
      },
      relations: ['author'],
    });
    return post;
  }

  async findOnePost(postData: Partial<Post>) {
    const post = await this.postRepository.findOne({
      where: postData,
      relations: ['author'],
    });
    return post;
  }

  async findAllPostsByAuthor(author: User) {
    const posts = await this.postRepository.find({
      where: {
        author: { id: author.id },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['author'],
    });

    return posts;
  }

  async create(dto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      slug: CreateSlug(dto.title),
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      coverImageUrl: dto.coverImgUrl,
      author,
    });

    const createdPost = await this.postRepository
      .save(post)
      .catch((err: unknown) => {
        if (err instanceof Error) {
          this.logger.error('Erro ao criar post', err.stack);
        }
        throw new BadRequestException('Erro ao criar o post');
      });

    return createdPost;
  }

  async update(postData: Partial<Post>, dto: UpdatePostDto, author: User) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Dados não enviados');
    }

    const post = await this.findOnePostByAuthorOrFail(postData, author);

    post.title = dto.title ?? post.title;
    post.content = dto.content ?? post.content;
    post.excerpt = dto.excerpt ?? post.excerpt;
    post.coverImageUrl = dto.coverImgUrl ?? post.coverImageUrl;
    post.published = dto.published ?? post.published;

    return this.postRepository.save(post);
  }
}

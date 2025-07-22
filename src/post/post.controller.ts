import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthenticatedRequest } from 'src/auth/types/authenticated-requests';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePostDto) {
    const post = await this.postService.create(dto, req.user);
    return new PostResponseDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/:id')
  async findPostByAuthor(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const post = await this.postService.findOnePostByAuthorOrFail(
      { id },
      req.user,
    );
    return new PostResponseDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findAllPostsByAuthor(@Req() req: AuthenticatedRequest) {
    const posts = await this.postService.findAllPostsByAuthor(req.user);

    return posts.map((post) => new PostResponseDto(post));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdatePostDto,
  ) {
    const post = await this.postService.update({ id }, dto, req.user);
    return new PostResponseDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/:id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const post = await this.postService.remove({ id }, req.user);
    return new PostResponseDto(post);
  }

  @Get(':slug')
  async findPostPublished(@Param('slug') slug: string) {
    const post = await this.postService.findOnePostOrFail({
      slug,
      published: true,
    });
    return new PostResponseDto(post);
  }

  @Get()
  async findAllPublishedPosts() {
    const posts = await this.postService.findAllPosts({ published: true });

    return posts.map((post) => new PostResponseDto(post));
  }
}

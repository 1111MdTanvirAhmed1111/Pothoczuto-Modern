import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(parseInt(id));
  }

  @Post()
  async createPost(@Body() data: { title: string; content: string; authorId: number }) {
    return this.postsService.createPost(data);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() data: { title?: string; content?: string },
  ) {
    return this.postsService.updatePost(parseInt(id), data);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(parseInt(id));
  }
} 
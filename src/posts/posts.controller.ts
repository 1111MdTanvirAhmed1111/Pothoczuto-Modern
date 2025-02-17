import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';

import { Express } from 'express';
import { multerConfig } from '../config/multer.config';

@Controller('api/posts')
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
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async createPost(
    @Body('postData') postData: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = JSON.parse(postData);
    const imageUrl = file ? `https://api.pothoczuto.xyz/images/uploads/${file.filename}` : '';
    return this.postsService.createPost(data, imageUrl);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updatePost(
    @Param('id') id: string,
    @Body('postData') postData: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = JSON.parse(postData);
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.postsService.updatePost(parseInt(id), {
      ...data,
      imageUrl,
    });
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(parseInt(id));
  }
} 
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PostsService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: ['query'],
    });
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  /** 
   * Retrieves all posts from the database
   * @returns Promise containing array of all posts
   */
  async getAllPosts() {
    return this.prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        // শুধু প্রয়োজনীয় ফিল্ড সিলেক্ট করুন
      },
      take: 20, // পেজিনেশন
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Retrieves a single post by its ID
   * @param id - The unique identifier of the post
   * @returns Promise containing the post if found, null otherwise
   */
  async getPostById(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  /**
   * Creates a new post in the database
   * @param data - Object containing title, content and authorId
   * @returns Promise containing the created post
   */
  async createPost( { 
    title,content,authorId
  }, imageUrl) {
    return this.prisma.post.create({
      data: {
        title,
        content,
        authorId,
        imageUrl,
      },
    });
  }

  /**
   * Updates an existing post
   * @param id - The unique identifier of the post to update
   * @param data - Object containing optional title, content and imageUrl updates
   * @returns Promise containing the updated post
   */
  async updatePost(
    id: number, 
    data: { 
      title?: string; 
      content?: string;
      imageUrl?: string;
    }
  ) {
    // Get the old post to check if we need to delete an old image
    const oldPost = await this.prisma.post.findUnique({
      where: { id },
    });

    // If there's a new image and an old image exists, delete the old one
    if (data.imageUrl && oldPost?.imageUrl) {
      const filename = oldPost.imageUrl.split('/').pop() || '';
      const oldImagePath = path.join('uploads', filename);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a post from the database
   * @param id - The unique identifier of the post to delete
   * @returns Promise containing the deleted post
   */
  async deletePost(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (post?.imageUrl) {
      const filename = post.imageUrl.split('/').pop();
      const imagePath = path.join('./images/uploads', filename || '');
      console.log(imagePath);
      if ( await fs.existsSync(imagePath)) {
       await fs.unlinkSync(imagePath);
      }
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }

  async findAll() {
    // select শুধু প্রয়োজনীয় ফিল্ডগুলো
    return this.prisma.post.findMany({
      select: {
        id: true,
        title: true,
        // শুধু প্রয়োজনীয় ফিল্ড সিলেক্ট করুন
      },
      take: 10, // পেজিনেশন ব্যবহার করুন
    });
  }
}
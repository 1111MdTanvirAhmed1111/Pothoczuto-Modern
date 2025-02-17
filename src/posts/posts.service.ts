import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

@Injectable()
export class PostsService {
  constructor() {}

  /**
   * Retrieves all posts from the database
   * @returns Promise containing array of all posts
   */
  async getAllPosts() {
    return prisma.post.findMany();
  }

  /**
   * Retrieves a single post by its ID
   * @param id - The unique identifier of the post
   * @returns Promise containing the post if found, null otherwise
   */
  async getPostById(id: number) {
    return prisma.post.findUnique({
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
    return prisma.post.create({
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
    const oldPost = await prisma.post.findUnique({
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

    return prisma.post.update({
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
    const post = await prisma.post.findUnique({
      where: { id },
    });

    // Delete the associated image if it exists
      if (post?.imageUrl) {
        const filename = post.imageUrl.split('/').pop() || '';

        const imagePath = path.join('uploads', filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

    return prisma.post.delete({
      where: { id },
    });
  }
}
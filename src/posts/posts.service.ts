import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
  async createPost(data: { title: string; content: string; authorId: number }) {
    return prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: data.authorId,
      },
    });
  }

  /**
   * Updates an existing post
   * @param id - The unique identifier of the post to update
   * @param data - Object containing optional title and content updates
   * @returns Promise containing the updated post
   */
  async updatePost(id: number, data: { title?: string; content?: string }) {
    return prisma.post.update({
      where: { id },
      data: data,
    });
  }

  /**
   * Deletes a post from the database
   * @param id - The unique identifier of the post to delete
   * @returns Promise containing the deleted post
   */
  async deletePost(id: number) {
    return prisma.post.delete({
      where: { id },
    });
  }
}
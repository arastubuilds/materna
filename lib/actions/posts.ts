'use server';

import { z } from "zod";
import { db } from "../db/index";
import { posts } from "../db/schema/posts";
import { sql, desc } from "drizzle-orm";
import { createResource } from "./resource";

const insertPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
});

export type NewPostParams = z.infer<typeof insertPostSchema>;

export const createPost = async (input: NewPostParams) => {
  try {
    const { title, content } = insertPostSchema.parse(input);

    await db.insert(posts).values({ title, content });
    await createResource({ title, content });

    return { success: true, message: "Post successfully created and embedded!" };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error creating post.",
    };
  }
};
export const getAllPosts = async () => {
  try {
    const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
    return allPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

const PAGE_SIZE = 5;

export const getPaginatedPosts = async (page: number = 1) => {
  try {
    const offset = (page - 1) * PAGE_SIZE;

    const data = await db
      .select()
      .from(posts)
      .orderBy(sql`${posts.createdAt} DESC`)
      .limit(PAGE_SIZE)
      .offset(offset);

    // Count total posts to know if there are more pages
    const [{ count }] = await db.execute<{ count: number }>(
      sql`SELECT COUNT(*)::int AS count FROM ${posts}`
    );

    const hasMore = page * PAGE_SIZE < count;

    return { data, hasMore };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { data: [], hasMore: false };
  }
};
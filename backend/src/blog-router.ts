import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { blogPosts, blogCategories } from "@db/schema";

export const blogRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        categorySlug: z.string().optional(),
        limit: z.number().min(1).max(50).optional(),
        offset: z.number().min(0).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = and(
        eq(blogPosts.published, true)
      );

      const posts = await db.query.blogPosts.findMany({
        where: conditions,
        with: { category: true, author: { columns: { id: true, name: true, avatar: true } } },
        orderBy: [desc(blogPosts.publishedAt)],
        limit: input?.limit || 10,
        offset: input?.offset || 0,
      });

      return posts;
    }),

  listAdmin: adminQuery.query(async () => {
    const db = getDb();
    return db.query.blogPosts.findMany({
      with: { category: true, author: { columns: { id: true, name: true } } },
      orderBy: [desc(blogPosts.createdAt)],
    });
  }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, input.slug),
        with: { category: true, author: { columns: { id: true, name: true, avatar: true } } },
      });
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        categoryId: z.number().optional(),
        published: z.boolean().optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user?.id;
      const result = await db.insert(blogPosts).values({
        ...input,
        authorId: userId,
        publishedAt: input.published ? new Date() : undefined,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        categoryId: z.number().optional(),
        published: z.boolean().optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      if (data.published) {
        await db.update(blogPosts)
          .set({ ...data, publishedAt: new Date() })
          .where(eq(blogPosts.id, id));
      } else {
        await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
      }
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(blogPosts).where(eq(blogPosts.id, input.id));
      return { success: true };
    }),
});

export const blogCategoryRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.query.blogCategories.findMany({
      orderBy: [blogCategories.name],
    });
  }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(blogCategories).values(input);
      return { id: Number(result[0].insertId) };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(blogCategories).where(eq(blogCategories.id, input.id));
      return { success: true };
    }),
});

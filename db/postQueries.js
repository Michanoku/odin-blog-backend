import { prisma } from "../lib/prisma.js";

// Look up a post by its ID
const lookupPostById = async (id) => {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

// Look up all posts
const lookupAllPosts = async () => {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

export { lookupPostById, lookupAllPosts };

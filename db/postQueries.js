import { prisma } from "../lib/prisma.js";

// Look up a post by its ID
const getPost = async (id) => {
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
const getAllPosts = async () => {
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

// Look up all posts by the owner
const getAllUserPosts = async (userId) => {
  return await prisma.post.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Create a new post
const createUserPost = async (userId, title, body, category, slug, published) => {
  const data = {
    userId,
    title,
    body,
    category,
    slug,
    published,
  };
  if (published) {
    data.publishedAt = new Date();
  }
  const post = await prisma.post.create({ data });
  return post;
};

const updateUserPost = async (id, title, body, category, slug, published) => {
  const data = {
    title,
    body,
    category,
    slug,
    published,
  };
  const existingPost = await prisma.post.findUnique({ where: { id } });
  if (existingPost.published !== published) {
    if (published) {
      data.publishedAt = new Date();
    } else {
      data.publishedAt = null;
    }
  }
  return await prisma.post.update({
    where: { id },
    data,
  });
};

const deleteUserPost = async (id) => {
  return await prisma.post.delete({
    where: { id },
  });
};

export {
  getPost,
  getAllPosts,
  getAllUserPosts,
  createUserPost,
  updateUserPost,
  deleteUserPost,
};

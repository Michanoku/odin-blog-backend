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

// Look up all posts (optional category)
const getAllPosts = async (category) => {
  return await prisma.post.findMany({
    where: {
      published: true,
      ...(category && { category }),
    },
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

// Look up a post by its ID and user
const getUserPost = async (userId, id) => {
  return await prisma.post.findUnique({
    where: { userId, id },
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

// Create a new post
const createUserPost = async (
  userId,
  title,
  body,
  category,
  slug,
  published,
) => {
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

const updateUserPost = async (userId, id, title, body, category, slug, published) => {
  const data = {
    title,
    body,
    category,
    slug,
    published,
  };
  const existingPost = await prisma.post.findUnique({ where: { userId, id } });
  if (existingPost.published !== published) {
    if (published) {
      data.publishedAt = new Date();
    } else {
      data.publishedAt = null;
    }
  }
  return await prisma.post.update({
    where: { userId, id },
    data,
  });
};

const deleteUserPost = async (userId, id) => {
  return await prisma.post.delete({
    where: { userId, id },
  });
};

export {
  getPost,
  getAllPosts,
  getUserPost,
  getAllUserPosts,
  createUserPost,
  updateUserPost,
  deleteUserPost,
};

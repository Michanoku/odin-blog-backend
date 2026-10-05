import { prisma } from "../lib/prisma.js";

// Look up a post by its ID
const getPost = async (id) => {
  return prisma.post.findUnique({
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
  return prisma.post.findMany({
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
const getAllAuthorPosts = async (userId) => {
  return prisma.post.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Create a new post
const createPost = async (data) => {
  if (data.published) {
    data.publishedAt = new Date();
  }
  return prisma.post.create({ data });
};

const updatePost = async (id, data) => {
  const existingPost = await prisma.post.findUnique({ where: { id } });
  if (!existingPost) {
    return null;
  }
  if (existingPost.published !== data.published) {
    if (data.published) {
      data.publishedAt = new Date();
    } else {
      data.publishedAt = null;
    }
  }
  return prisma.post.update({
    where: { id },
    data,
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

// Delete a single post
const deletePost = async (id) => {
  return prisma.post.delete({
    where: { id },
  });
};

export {
  getPost,
  getAllPosts,
  getAllAuthorPosts,
  createPost,
  updatePost,
  deletePost,
};

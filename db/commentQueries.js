import { prisma } from "../lib/prisma.js";

// Create a new comment
const createComment = async (data) => {
  return prisma.comment.create({
    data,
    include: {
      user: true,
    },
  });
};

// Update an existing comment
const updateComment = async (id, body) => {
  return prisma.comment.update({
    where: { id },
    data: { body },
    include: {
      user: true,
    },
  });
};

// Delete an existing comment
const deleteComment = async (id) => {
  return prisma.comment.delete({
    where: { id },
  });
};

// Look up all comments by their post
const getAllComments = async (postId) => {
  return prisma.comment.findMany({
    where: { postId },
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

// Look up a comment by its ID
const getComment = async (id) => {
  return await prisma.comment.findUnique({
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

export {
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
  getComment,
};

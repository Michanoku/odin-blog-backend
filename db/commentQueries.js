import { prisma } from "../lib/prisma.js";

// Create a new comment
const createComment = async (userId, postId, body) => {
  const comment = await prisma.comment.create({
    data: {
      userId,
      postId,
      body,
    },
  });
  return comment;
};

const updateComment = async (id, body) => {
  return await prisma.comment.update({
    where: { id },
    data: { body },
  });
};

const deleteComment = async (id) => {
  return await prisma.comment.delete({
    where: { id },
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

// Look up all comments by their post
const getAllComments = async (postId) => {
  return await prisma.comment.findMany({
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

export {
  createComment,
  updateComment,
  deleteComment,
  getComment,
  getAllComments,
};

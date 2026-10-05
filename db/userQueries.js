// All prisma queries that have to do with the user
import { prisma } from "../lib/prisma.js";

// Create a new user with the email and the hash provided
const createUser = async (data) => {
  return prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      username: true,
      author: true,
    },
  });
};

// Update the user from the data received
const updateUser = async (id, options) => {
  const data = {};

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined) {
      data[key] = value;
    }
  }

  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      username: true,
      author: true,
    },
  });
};

// Make the user an author or not
const changeAuthorStatus = async (id, status) => {
  return prisma.user.update({
    where: { id },
    data: { author: status },
  });
};

// Look up the user while including the hash for login
const lookupUserForLogin = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      author: true,
      hash: true,
    },
  });
};

// Look up the user and return a safe object
const lookupUser = async (where) => {
  return prisma.user.findUnique({
    where,
    select: {
      id: true,
      email: true,
      username: true,
      author: true,
    },
  });
};

// Get the hash for validator password check
const getUserHash = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      hash: true,
    },
  });
};

export {
  createUser,
  lookupUserForLogin,
  lookupUser,
  updateUser,
  changeAuthorStatus,
  getUserHash,
};

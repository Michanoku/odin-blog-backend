// All prisma queries that have to do with the user
import { prisma } from "../lib/prisma.js";

// Create a new user with the email and the hash provided
const createUser = async (username, email, hash) => {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        hash,
      },
    });
    return user;
};

const updateUser = async (id, username, email, hash) => {
  const data = {};

  if (username) {
    data.username = username;
  }

  if (email) {
    data.email = email;
  }

  if (hash) {
    data.hash = hash;
  }
  return await prisma.user.update({
    where: { id },
    data,
  });
};

// Look up a user by their email
const lookupUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

// Look up a user by their ID
const lookupUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export { createUser, lookupUserByEmail, lookupUserById, updateUser };

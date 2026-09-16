import "../config/env.js";
import { prisma } from "../lib/prisma.js";

async function main() {
  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const michael = await prisma.user.create({
    data: {
      username: "Michael",
      email: "michael@example.com",
      hash: "fake-hash-for-development",
      author: true,
    },
  });

  const alice = await prisma.user.create({
    data: {
      username: "Alice",
      email: "alice@example.com",
      hash: "fake-hash-for-development",
      author: false,
    },
  });

  const bob = await prisma.user.create({
    data: {
      username: "Bob",
      email: "bob@example.com",
      hash: "fake-hash-for-development",
      author: false,
    },
  });

  // Posts
  const post1 = await prisma.post.create({
    data: {
      title: "My First Post",
      body: "This is the body of my first blog post.",
      category: "General",
      slug: "my-first-post",
      published: true,
      publishedAt: new Date("2026-09-01"),
      userId: michael.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "A Day in Morioka",
      body: "Today I went for a walk around Morioka...",
      category: "Travel",
      slug: "a-day-in-morioka",
      published: true,
      publishedAt: new Date("2026-09-05"),
      userId: michael.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: "Unfinished Thoughts",
      body: "This post isn't ready for publication yet.",
      category: "Personal",
      slug: "unfinished-thoughts",
      published: false,
      userId: michael.id,
    },
  });

  // Comments
  await prisma.comment.createMany({
    data: [
      {
        body: "Great post!",
        userId: alice.id,
        postId: post1.id,
      },
      {
        body: "I've been there too.",
        userId: bob.id,
        postId: post2.id,
      },
      {
        body: "Looking forward to the next one.",
        userId: alice.id,
        postId: post2.id,
      },
    ],
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
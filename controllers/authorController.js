import slugify from "slugify";

import {
  getAllUserPosts,
  createUserPost,
  getUserPost,
  updateUserPost,
  deleteUserPost,
} from "../db/postQueries.js";

const postsGetAll = async (req, res) => {
  try {
    const posts = await getAllUserPosts(req.user.id);
    return res.status(200).json(posts);
  } catch (err) {
    return next(err);
  }
};

const postsGet = async (req, res) => {
  try {
    const post = await getUserPost(req.user.id, req.params.postId);
    return res.status(200).json(post);
  } catch (err) {
    return next(err);
  }
};

const postsCreate = async (req, res, next) => {
  const category = req.body.postCategory ? req.body.postCategory : "Uncategorized";
  const slug = slugify(req.body.postTitle, {
    lower: true,
    strict: true,
  });
  try {
    const post = await createUserPost(
      req.user.id,
      req.body.postTitle,
      req.body.postBody,
      category,
      slug,
      req.body.published,
    );
    return res.status(201).json(post);
  } catch (err) {
    return next(err);
  }
};

const postsUpdate = async (req, res, next) => {
  const category = req.body.postCategory ? req.body.postCategory : "Uncategorized";
  const slug = slugify(req.body.postTitle, {
    lower: true,
    strict: true,
  });
  try {
    const post = await updateUserPost(
      req.user.id,
      req.params.postId,
      req.body.postTitle,
      req.body.postBody,
      category,
      slug,
      req.body.published,
    );
    return res.status(200).json(post);
  } catch (err) {
    return next(err);
  }
};

const postsDelete = async (req, res, next) => {
  try {
    await deleteUserPost(req.user.id, req.params.postId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

const getCurrentUser = (req, res) => {

  if (!req.user.author) {
    return res.status(403).json({
      message: "Author access required.",
    });
  }

  return res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,
    author: req.user.author,
  });

};

export { postsGetAll, postsGet, postsCreate, postsUpdate, postsDelete, getCurrentUser };

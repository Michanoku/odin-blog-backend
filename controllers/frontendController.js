import * as commentQueries from "../db/commentQueries.js";
import { getAllPosts, getPost } from "../db/postQueries.js";

// Get all posts
const postsGetAll = async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    return res.status(200).json(posts);
  } catch (error) {
    return next(error);
  }
};

// Get a single post
const postsGetSingle = async (req, res, next) => {
  try {
    const post = await getPost(req.params.postId);
    return res.status(200).json(post);
  } catch (error) {
    return next(error);
  }
};

// Get all comments from a post
const commentsGetAll = async (req, res, next) => {
  try {
    const comments = await commentQueries.getAllComments(req.params.postId);
    return res.status(200).json(comments);
  } catch (error) {
    return next(error);
  }
};

// Create a new comment on a post
const commentsCreate = async (req, res, next) => {
  try {
    const data = {
      userId: req.user.id,
      postId: req.params.postId,
      body: req.body.commentBody,
    };
    const comment = await commentQueries.createComment(data);
    return res.status(201).json(comment);
  } catch (error) {
    return next(error);
  }
};

// Update an existing comment
const commentsUpdate = async (req, res, next) => {
  try {
    const comment = await commentQueries.updateComment(
      req.params.commentId,
      req.body.commentBody,
    );
    return res.status(200).json(comment);
  } catch (error) {
    return next(error);
  }
};

// Delete an existing comment
const commentsDelete = async (req, res, next) => {
  try {
    await commentQueries.deleteComment(req.params.commentId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export {
  postsGetAll,
  postsGetSingle,
  commentsGetAll,
  commentsCreate,
  commentsUpdate,
  commentsDelete,
};

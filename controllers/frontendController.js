import * as commentQueries from "../db/commentQueries.js";
import { getAllPosts, getPost } from "../db/postQueries.js";

const postsGetAll = async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    return res.status(200).json(posts);
  } catch (err) {
    return next(err);
  }
};

const postsGetSingle = async (req, res, next) => {
  try {
    const post = await getPost(req.params.postId);
    return res.status(200).json(post);
  } catch (err) {
    return next(err);
  }
};

const commentsGetAll = async (req, res, next) => {
  try {
    const comments = await commentQueries.getAllComments(
      req.params.postId,
    );
    return res.status(200).json(comments);
  } catch (err) {
    return next(err);
  }
};

const commentsGetSingle = async (req, res, next) => {
  try {
    const comment = await commentQueries.getComment(
      req.params.commentId,
    );
    return res.status(200).json(comment);
  } catch (err) {
    return next(err);
  }
};

const commentsCreate = async (req, res, next) => {
  try {
    const comment = await commentQueries.createComment(
      req.user.id,
      req.params.postId,
      req.body.commentBody,
    );
    return res.status(201).json(comment);
  } catch (err) {
    return next(err);
  }
};

const commentsUpdate = async (req, res, next) => {
  try {
    const comment = await commentQueries.updateComment(
      req.params.commentId,
      req.body.commentBody,
    );
    return res.status(200).json(comment);
  } catch (err) {
    return next(err);
  }
};

const commentsDelete = async (req, res, next) => {
  try {
    await commentQueries.deleteComment(req.params.commentId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export {
  postsGetAll,
  postsGetSingle,
  commentsGetAll,
  commentsGetSingle,
  commentsCreate,
  commentsUpdate,
  commentsDelete,
};

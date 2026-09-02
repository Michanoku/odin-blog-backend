import {
  getAllUserPosts,
  createUserPost,
  getPost,
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
    const post = await getPost(req.params.postId);
    return res.status(200).json(post);
  } catch (err) {
    return next(err);
  }
};

const postsCreate = async (req, res, next) => {
  try {
    const post = await createUserPost(
      req.user.id,
      req.body.postTitle,
      req.body.postBody,
      req.body.published,
    );
    return res.status(201).json(post);
  } catch (err) {
    return next(err);
  }
};

const postsUpdate = async (req, res, next) => {
  try {
    const post = await updateUserPost(
      req.params.postId,
      req.body.postTitle,
      req.body.postBody,
      req.body.published,
    );
    return res.status(200).json(post);
  } catch (err) {
    return next(err);
  }
};

const postsDelete = async (req, res, next) => {
  try {
    await deleteUserPost(req.params.postId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export { postsGetAll, postsGet, postsCreate, postsUpdate, postsDelete };

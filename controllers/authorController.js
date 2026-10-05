import {
  getAllAuthorPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from "../db/postQueries.js";

// Get app posts from the author
const postsGetAll = async (req, res, next) => {
  try {
    const posts = await getAllAuthorPosts(req.user.id);
    return res.status(200).json(posts);
  } catch (error) {
    return next(error);
  }
};

// Get single post from the author
const postsGet = async (req, res, next) => {
  try {
    const post = await getPost(req.params.postId);
    return res.status(200).json(post);
  } catch (error) {
    return next(error);
  }
};

// Create a new author post
const postsCreate = async (req, res, next) => {
  // Get category or use "Uncategorized"
  const category = req.body.postCategory
    ? req.body.postCategory
    : "Uncategorized";
  try {
    const data = {
      userId: req.user.id,
      title: req.body.postTitle,
      body: req.body.postBody,
      category,
      published: req.body.published === "on",
    };
    const post = await createPost(data);
    return res.status(201).json(post);
  } catch (error) {
    return next(error);
  }
};

// Update the authors post
const postsUpdate = async (req, res, next) => {
  // Get category or use "Uncategorized"
  const category = req.body.postCategory
    ? req.body.postCategory
    : "Uncategorized";
  try {
    const data = {
      title: req.body.postTitle,
      body: req.body.postBody,
      category,
      published: req.body.published === "on",
    };
    const post = await updatePost(req.params.postId, data);
    return res.status(200).json(post);
  } catch (error) {
    return next(error);
  }
};

// Delete the authors post
const postsDelete = async (req, res, next) => {
  try {
    await deletePost(req.params.postId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

// Return the current Author
const getCurrentAuthor = (req, res) => {
  // If the user is not an author, reject
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

export {
  postsGetAll,
  postsGet,
  postsCreate,
  postsUpdate,
  postsDelete,
  getCurrentAuthor,
};

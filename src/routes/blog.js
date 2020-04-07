const express = require('express');
const router = express.Router();
const blogModel = require('../model/blogModel');
router.get('/', (req, res) => {
  blogModel.getBlogs(req, res);
});
router.get('/:blog_id', (req, res) => {
  blogModel.getBlogsById(req, res);
});
router.post('/add', (req, res) => {
  blogModel.insertBlog(req, res);
});
router.get('/:blog_id/view', (req, res) => {
  blogModel.viewBlog(req, res);
});
router.get('/:blog_id/like', (req, res) => {
  blogModel.likeBlog(req, res);
});
router.get('/draft', (req, res) => {
  blogModel.deletedBlog(req, res);
});
router.get('/deleted', (req, res) => {
  blogModel.deletedBlog(req, res);
});
module.exports = router;

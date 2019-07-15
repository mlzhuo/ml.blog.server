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
router.get('/category/:user_id', (req, res) => {
  blogModel.getCategory(req, res);
});
module.exports = router;

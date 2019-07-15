const express = require('express');
const router = express.Router();
const userModel = require('../model/userModel');
const logModel = require('../model/logModel');
const blogModel = require('../model/blogModel');
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});
router.post('/login', (req, res) => {
  userModel.userLogin(req, res);
});
router.post('/register', (req, res) => {
  userModel.userRegister(req, res);
});
router.post('/log', (req, res) => {
  logModel.insertLog(req, res);
});
router.post('/upload', (req, res) => {
  blogModel.uploadBlogImage(req, res);
});
module.exports = router;

const assert = require('assert');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const blogModel = require('../schema/blogSchema');
const userModel = require('../schema/userSchema');
const { ApiResponse, CheckToken } = require('../utils/apiUtils');
const MESSAGE = require('../constant/message');
const { formatDate } = require('../utils/dateUtils');

module.exports = {
  getCategory: (req, res) => {
    const { user_id } = req.params;
    userModel.findOne({ _id: user_id }, ['blog_category'], (err, doc) => {
      if (err) {
        assert.equal(null, err);
      }
      res.json(
        ApiResponse({
          state: true,
          data: doc.blog_category
        })
      );
    });
  },
  getBlogs: (req, res) => {
    let { user_id, category_id, tag_id, page, pagesize } = req.query;
    pagesize = parseInt(pagesize);
    let skip = parseInt((page - 1) * pagesize);
    let query = { user_id, is_secret: 0, is_delete: 0, state: 0 };
    if (tag_id) {
      query = {
        user_id,
        category_id,
        tag_id,
        is_secret: 0,
        is_delete: 0,
        state: 0
      };
    }
    blogModel
      .find(query, (err, docs) => {
        if (err) {
          assert.equal(null, err);
        }
        res.json(
          ApiResponse({
            state: true,
            data: docs
          })
        );
      })
      .skip(skip)
      .limit(pagesize)
      .sort({ date: -1 });
  },
  getBlogsById: (req, res) => {
    const { blog_id } = req.params;
    blogModel.findById({ _id: blog_id }, (err, doc) => {
      if (err) {
        assert.equal(null, err);
      }
      res.json(
        ApiResponse({
          state: true,
          data: doc
        })
      );
    });
  },
  getSecretBlogs: (req, res) => {
    const { user_id, page, pagesize } = req.query;
    pagesize = parseInt(pagesize);
    let skip = parseInt((page - 1) * pagesize);
    if (!CheckToken({ req, user_id })) {
      return res
        .status(403)
        .send(ApiResponse({ state: false, message: MESSAGE.INVALID_TOKEN }));
    }
    blogModel
      .find({ user_id, is_delete: 0, is_secret: 1, state: 0 }, (err, docs) => {
        if (err) {
          assert.equal(null, err);
        }
        res.json(
          ApiResponse({
            state: true,
            data: docs
          })
        );
      })
      .skip(skip)
      .limit(pagesize)
      .sort({ date: -1 });
  },
  insertBlog: (req, res) => {
    const date = new Date().toISOString();
    const _id = new global.ObjectId();
    const blog = new blogModel({
      ...req.body,
      date,
      _id
    });
    blog.save(err => {
      if (err) {
        assert.equal(null, err);
      }
      res.json(
        ApiResponse({
          state: true,
          data: { _id },
          message: MESSAGE.ADD_BLOG_SUCCESS
        })
      );
    });
  },
  uploadBlogImage: (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fileds, files) {
      if (err) {
        return console.log(err);
      }
      let imgPath = files.img.path;
      const date = formatDate(new Date());
      const ranObjectId = new global.ObjectId();
      const ext = path.extname(files.img.name);
      let imgName = `public/images/${date}_${ranObjectId}${ext}`;
      let data = fs.readFileSync(imgPath);
      fs.writeFile(imgName, data, function(err) {
        if (err) {
          return console.log(err);
        }
        fs.unlink(imgPath, function() {});
      });
      res.json(
        ApiResponse({
          state: true,
          data: {
            img: `http://${global.service_url}:${global.service_port}/${imgName}`
          }
        })
      );
    });
  }
};

const assert = require('assert')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const blogModel = require('../schema/blogSchema')
const userModel = require('../schema/userSchema')
const { ApiResponse, CheckToken } = require('../utils/apiUtils')
const MESSAGE = require('../constant/message')
const { formatDate } = require('../utils/dateUtils')

const blogsAction = (query, skip, pagesize, res) => {
  let total = 0
  blogModel.count(query, (err, count) => {
    if (err) {
      assert.equal(null, err)
    }
    total = count
  })
  blogModel
    .find(query, (err, docs) => {
      if (err) {
        assert.equal(null, err)
      }
      res.json(
        ApiResponse({
          state: true,
          data: { total, blog: docs }
        })
      )
    })
    .skip(skip)
    .limit(pagesize)
    .sort({ date: -1 })
}

module.exports = {
  getBlogs: (req, res) => {
    let { user_id, category_id, tag_id, page, pagesize } = req.query
    pagesize = parseInt(pagesize)
    let skip = parseInt((page - 1) * pagesize)
    let query = { user_id, is_delete: 0, state: 0 }
    if (tag_id) {
      query = {
        user_id,
        category_id,
        tag_id,
        is_delete: 0,
        state: 0
      }
    }
    blogsAction(query, skip, pagesize, res)
  },
  getBlogsById: (req, res) => {
    const { blog_id } = req.params
    blogModel.findById({ _id: blog_id }, (err, doc) => {
      if (err) {
        assert.equal(null, err)
      }
      res.json(
        ApiResponse({
          state: true,
          data: doc
        })
      )
    })
  },
  insertBlog: (req, res) => {
    const date = new Date().toISOString()
    const _id = new global.ObjectId()
    const blog = new blogModel({
      ...req.body,
      date,
      _id
    })
    blog.save(err => {
      if (err) {
        assert.equal(null, err)
      }
      res.json(
        ApiResponse({
          state: true,
          data: { _id },
          message: MESSAGE.ADD_BLOG_SUCCESS
        })
      )
    })
  },
  uploadBlogImage: (req, res) => {
    let form = new formidable.IncomingForm()
    form.parse(req, function(err, fileds, files) {
      if (err) {
        return console.log(err)
      }
      let imgPath = files.img.path
      const date = formatDate(new Date())
      const ranObjectId = new global.ObjectId()
      const ext = path.extname(files.img.name)
      let imgName = `public/image/${date}_${ranObjectId}${ext}`
      let data = fs.readFileSync(imgPath)
      fs.writeFile(imgName, data, function(err) {
        if (err) {
          return console.log(err)
        }
        fs.unlink(imgPath, function() {})
      })
      res.json(
        ApiResponse({
          state: true,
          data: {
            img: `${global.config.service_url}/${imgName}`
          }
        })
      )
    })
  },
  viewBlog: (req, res) => {
    const { blog_id } = req.params
    blogModel.updateOne(
      { _id: blog_id },
      {
        $inc: {
          view: 1 //每次自增长1
        }
      },
      (err, doc) => {
        res.json(
          ApiResponse({
            state: true
          })
        )
      }
    )
  },
  likeBlog: (req, res) => {
    const { blog_id } = req.params
    blogModel.updateOne(
      { _id: blog_id },
      {
        $inc: {
          like: 1 //每次自增长1
        }
      },
      (err, doc) => {
        res.json(
          ApiResponse({
            state: true
          })
        )
      }
    )
  },
  draftBlog: (req, res) => {
    let { user_id, page, pagesize } = req.query
    pagesize = parseInt(pagesize)
    let skip = parseInt((page - 1) * pagesize)
    const query = { user_id, is_delete: 0, state: 1 }
    blogsAction(query, skip, pagesize, res)
  },
  deletedBlog: (req, res) => {
    let { user_id, page, pagesize } = req.query
    pagesize = parseInt(pagesize)
    let skip = parseInt((page - 1) * pagesize)
    const query = { user_id, is_delete: 1 }
    blogsAction(query, skip, pagesize, res)
  }
}

const assert = require('assert')
const jwt = require('jsonwebtoken')
const key = global.JWT_KEY
const userModel = require('../schema/userSchema')
const { ApiResponse, CheckToken } = require('../utils/apiUtils')
const MESSAGE = require('../constant/message')

module.exports = {
  userLogin: (req, res) => {
    const { username, password } = req.body
    userModel.findOne({ username }, (err, doc) => {
      if (err) {
        assert.equal(null, err)
      }
      if (!doc) {
        res.json(
          ApiResponse({
            state: false,
            message: MESSAGE.USERNAME_DOES_NOT_EXIST,
          })
        )
        return
      }
      if (doc.password === password) {
        const { _id, username, password } = doc
        const token = jwt.sign({ _id, username, password }, key, {
          expiresIn: 24 * 60 * 60,
        })
        res.json(
          ApiResponse({
            state: true,
            data: { ...doc.toJSON(), token },
            message: MESSAGE.LOGIN_SUCCESSFUL,
          })
        )
      } else {
        res.json(
          ApiResponse({
            state: false,
            message: MESSAGE.THE_PASSWORD_IS_INCORRECT,
          })
        )
      }
    })
  },
  userRegister: (req, res) => {
    const { username, password } = req.body
    const user = new userModel({
      username,
      password,
      blog_category: [
        {
          name: '默认分组',
          blog_tag: [],
        },
      ],
    })
    userModel.findOne({ username }, (err, doc) => {
      if (err) {
        assert.equal(null, err)
      }
      if (doc) {
        res.json(
          ApiResponse({
            state: false,
            message: MESSAGE.USERNAME_HAS_ALREADY_BEEN_REGISTERED,
          })
        )
        return
      }
      user.save((err, resp) => {
        if (err) {
          assert.equal(null, err)
        }
        res.json(
          ApiResponse({
            state: true,
            data: resp,
            message: MESSAGE.REGISTRATION_SUCCESS,
          })
        )
      })
    })
  },
  findById: (req, res) => {
    const { user_id } = req.params
    if (!CheckToken({ req, user_id })) {
      return res
        .status(403)
        .send(ApiResponse({ state: false, message: MESSAGE.INVALID_TOKEN }))
    }
    userModel.findById({ _id: user_id }, (err, doc) => {
      if (err) {
        assert.equal(null, err)
      }
      res.json(
        ApiResponse({
          state: true,
          data: doc,
        })
      )
    })
  },
  findByName: (req, res) => {
    const { username } = req.params
    userModel.findOne({ username }, (err, doc) => {
      if (err) {
        assert.equal(null, err)
      }
      res.json(
        ApiResponse({
          state: true,
          data: doc,
        })
      )
    })
  },
  createCategory: async (req, res) => {
    const { user_id, category_name } = req.body
    const user = await userModel.findById({ _id: user_id })
    const { blog_category } = user
    const newBlogCategory = [
      ...blog_category,
      {
        name: category_name,
        blog_tag: [],
      },
    ]
    userModel.updateOne(
      { _id: user_id },
      { blog_category: newBlogCategory },
      (err, raw) => {
        if (err) {
          assert.equal(null, err)
        }
        res.json(
          ApiResponse({
            state: true,
            message: MESSAGE.CREATE_SUCCESS,
          })
        )
      }
    )
  },
  createTag: async (req, res) => {
    const { user_id, category_id, tag_name } = req.body
    const user = await userModel.findById({ _id: user_id })
    let { blog_category } = user
    const categoryIndex = blog_category.findIndex((v) => v._id == category_id)
    const category = blog_category[categoryIndex]
    const { blog_tag } = category
    const newBlogTag = blog_tag.concat([{ name: tag_name }])
    // console.log(newBlogTag)
    blog_category[categoryIndex].blog_tag = newBlogTag
    userModel.updateOne({ _id: user_id }, { blog_category }, (err, raw) => {
      if (err) {
        assert.equal(null, err)
      }
      res.json(
        ApiResponse({
          state: true,
          message: MESSAGE.CREATE_SUCCESS,
        })
      )
    })
  },
}

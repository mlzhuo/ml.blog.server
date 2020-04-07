const express = require('express')
const router = express.Router()
const userModel = require('../model/userModel')

router.get('/:user_id', (req, res) => {
  userModel.findById(req, res)
})
router.post('/:user_id/create_category', (req, res) => {
  userModel.createCategory(req, res)
})
router.post('/:user_id/create_tag', (req, res) => {
  userModel.createTag(req, res)
})
module.exports = router

const express = require('express')
const router = express.Router()
const userModel = require('../model/userModel')

router.get('/:user_id', (req, res) => {
  userModel.findById(req, res)
})
module.exports = router

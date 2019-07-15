const assert = require('assert');
const jwt = require('jsonwebtoken');
const key = global.JWT_KEY;
const userModel = require('../schema/userSchema');
const { ApiResponse, CheckToken } = require('../utils/apiUtils');
const MESSAGE = require('../constant/message');

module.exports = {
  userLogin: (req, res) => {
    const { username, password } = req.body;
    userModel.findOne({ username }, (err, doc) => {
      if (err) {
        assert.equal(null, err);
      }
      if (!doc) {
        res.json(
          ApiResponse({
            state: false,
            message: MESSAGE.USERNAME_DOES_NOT_EXIST
          })
        );
        return;
      }
      if (doc.password === password) {
        const { _id, username, password } = doc;
        const token = jwt.sign({ _id, username, password }, key, {
          expiresIn: 24 * 60 * 60
        });
        res.json(
          ApiResponse({
            state: true,
            data: { ...doc.toJSON(), token },
            message: MESSAGE.LOGIN_SUCCESSFUL
          })
        );
      } else {
        res.json(
          ApiResponse({
            state: false,
            message: MESSAGE.THE_PASSWORD_IS_INCORRECT
          })
        );
      }
    });
  },
  userRegister: (req, res) => {
    const { username, password } = req.body;
    const user = new userModel({
      username,
      password
    });
    userModel.findOne({ username }, (err, doc) => {
      if (err) {
        assert.equal(null, err);
      }
      if (doc) {
        res.json(
          ApiResponse({
            state: false,
            message: MESSAGE.USERNAME_HAS_ALREADY_BEEN_REGISTERED
          })
        );
        return;
      }
      user.save((err, resp) => {
        if (err) {
          assert.equal(null, err);
        }
        res.json(
          ApiResponse({
            state: true,
            data: resp,
            message: MESSAGE.REGISTRATION_SUCCESS
          })
        );
      });
    });
  },
  findById: (req, res) => {
    const { user_id } = req.params;
    if (!CheckToken({ req, user_id })) {
      return res
        .status(403)
        .send(ApiResponse({ state: false, message: MESSAGE.INVALID_TOKEN }));
    }
    userModel.findById({ _id: user_id }, (err, doc) => {
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
  findByName: (req, res) => {
    const { username } = req.params;
    userModel.findOne({ username }, (err, doc) => {
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
  }
};

const assert = require('assert');
const logModel = require('../schema/logSchema');
const { ApiResponse } = require('../utils/apiUtils');
const MESSAGE = require('../constant/message');

module.exports = {
  insertLog: (req, res) => {
    const date = new Date().toISOString();
    const { user_id, type } = req.body;
    const ip =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    const log = new logModel({ user_id, type, ip, date });
    log.save(err => {
      if (err) {
        assert.equal(null, err);
      }
      res.json(ApiResponse({ state: true, message: MESSAGE.SAVE_LOG_SUCCESS }));
    });
  }
};

module.exports = {
  ApiResponse: ({ state, data, message }) => {
    return {
      state: state,
      data: data || {},
      message: message || 'request success'
    };
  },
  GetToken: req => {
    let token =
      req.body.token || req.query.token || req.headers['authorization'] || '';
    return token.split(' ')[1];
  },
  CheckToken: ({ req, user_id }) => {
    const { _id } = req.decoded;
    if (_id === user_id) {
      return true;
    }
    return false;
  }
};

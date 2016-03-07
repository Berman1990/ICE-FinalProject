/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  var path = require('path');
    res.sendFile(path.join(__dirname, '../public', 'main.html'));
};
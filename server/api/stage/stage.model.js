var mongoose = require('mongoose');

var stageSchema = new mongoose.Schema({
  id: { type: String, unique: true }
});




module.exports = mongoose.model('Stage', stageSchema);
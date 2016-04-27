var mongoose = require('mongoose');

var stageSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: String,
  difficulty: Number,
  description: String,
  startpoint: String,
  endpoint: String,
  objects: [String],
  commands: [String]
});

stageSchema.methods.getAllStages = function(){
 var Stages = mongoose.model('Stages', stageSchema);
    var stages = Stages.find({});
  //return StagesList;
};

stageSchema.getTest = function() {
  console.log("Hello World");
};

stageSchema.methods.getTest = function() {
  console.log("Hello World");
};

stageSchema.methods.getStageById = function(stageId){
  var Stages = mongoose.model('Stages', stageSchema);
  var Stage = Stages.findOne({'id': stageId});
  return Stage;
};

module.exports = mongoose.model('Stage', stageSchema);

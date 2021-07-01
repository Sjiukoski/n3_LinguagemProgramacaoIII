var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var carConsumeSchema = new Schema({
  distance: {
    type: Number,
    Required: "Distance is mandatory",
  },
  consume: {
    type: Number,
    Required: "Consume is mandatory",
  },
  speed: {
    type: Number,
    Required: "Speed is mandatory",
  },
  temp_inside: { 
    type: Number, 
    Required: "Temp_inside is mandatory" 
  },
});

var carConsume = mongoose.model("CarConsume", carConsumeSchema);

module.exports = carConsume;

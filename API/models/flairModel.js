const mongoose = require('mongoose');
const validator = require('validator');
const flairSchema = new mongoose.Schema({

    text: {
      type: String,
      required: [true, 'A flair must have a name'],
      trim: true,
      maxlength: [64, 'Flair name must have less or equal than 64 characters']
    },
    textColor: {
      type: String,
      required: false,
      trim: true,
      validate:[validator.isHexColor,'provide valid hexadecimal color']
    },
    backgroundColor: {
      type: String,
      required: false,
      trim: true,
      validate:[validator.isHexColor,'provide valid hexadecimal color']
    },
    permissions: {
      type: String,
      required:false,
      enum:['modOnly','allowEdit']
    }



});

const Flair = mongoose.model('Flair', flairSchema);
module.exports = Flair;

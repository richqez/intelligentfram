var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChannelSchema = new Schema({
  name: {
        type: String,
        unique: false,
        required: true
    },
  description: {
        type: String,
        required: false,
    },
  user : { type: Schema.Types.ObjectId , ref : 'User'}

},{
  timestamps:true
});

module.exports = mongoose.model('Channel', ChannelSchema);

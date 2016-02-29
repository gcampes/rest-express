var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counter = require('./counter');

var CountrySchema = new mongoose.Schema({
  id: 'string',
  active: Boolean,
	name: 'string',
	description: 'string',
  created: Date
});

CountrySchema.pre('save', function(next) {
  var doc = this;

  now = new Date();
  doc.created = now;
  if ( !doc.created ) {
    doc.created = now;
  }

  counter.findByIdAndUpdate({
    _id: 'caseid'
  }, {
    $inc: {
      seq: 1
    }
  }, function(error, counter) {
    if (error) {
      return next(error);
    }
    if(!doc.id){
      doc.id = counter.seq;
    }
    next();
  });
});

module.exports = CountrySchema;

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

var app = express();

app.use(bodyParser());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

mongoose.connect('mongodb://localhost/Orbit');

var PersonSchema = new mongoose.Schema({
	name: 'string',
	age: 'string',
});

var PersonModel = mongoose.model('person', PersonSchema);

app.get('/api/people', function(req,res) {
	PersonModel.find({},function(err,docs) {
		if(err) {
			res.send({error:err});
		}
		else {
			res.send({person:docs});
		}
	});
});

app.post('/api/people', function(req, res) {
  var person = new PersonModel({
    name: req.body.person.name,
    age: req.body.person.age
  });

  person.save(function(err, person){
    if(err){
      console.log(err);
    }
    else{
      res.end(JSON.stringify(person));
    }
  });
});

app.put('/api/people/:id', function(req, res){
  var person = new PersonModel({
    _id: req.query.id,
    name: req.body.person.name,
    age: req.body.person.age
  });

  PersonModel.update(person, function(err, person){
    if(err){
      console.log(err);
    }
    else{
      res.end(JSON.stringify(person));
    }
  })
})

app.listen('3000');

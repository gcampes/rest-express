var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

mongoose.connect('mongodb://localhost/magic-crud');

var Country = mongoose.model('Country', require('./models/country'));
var City = mongoose.model('City', require('./models/city'));
var Counter = require('./models/counter');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  Counter.find({
    _id: 'caseid'
  }, function(err, counter) {
    if (counter.length === 0) {
      counter = new Counter({
        _id: 'caseid',
        seq: 1
      });
      counter.save();
    }
  });
});

app.get('/api/countries', function(req, res) {
  Country.find({}, function(err, docs) {
    var data = docs.map(function(d, index) {
      return {
        id: d.id,
        attributes: {
          active: d.active,
          name: d.name,
          description: d.description,
          created: d.created
        },
        type: "countries"
      };
    });
    if (err) {
      res.send({
        error: err
      });
    } else {
      res.send({
        data: data
      });
    }
  });
});

app.get('/api/cities', function(req, res) {
  City.find({}, function(err, docs) {
    var data = docs.map(function(d, index) {
      return {
        id: d.id,
        attributes: {
          active: d.active,
          name: d.name,
          description: d.description,
          country: d.country,
          created: d.created
        },
        type: "countries"
      };
    });
    if (err) {
      res.send({
        error: err
      });
    } else {
      res.send({
        data: data
      });
    }
  });
});

app.get('/api/countries/:id', function(req, res) {
  Country.findOne({
    'id': req.params.id
  }).exec(function(err, country) {
    var data = {
      links: {
        self: 'http://localhost:3000/api/countries/' + country.id
      },
      id: country.id,
      attributes: {
        name: country.name,
        description: country.description,
        created: country.created
      },
      type: "countries"
    };
    if (err) {
      res.send({
        error: err
      });
    } else {
      res.send({
        data: data
      });
    }
  });
});

app.post('/api/countries', function(req, res) {
  var country = new Country({
    active: req.body.data.attributes.active,
    name: req.body.data.attributes.name,
    description: req.body.data.attributes.description
  });

  country.save(function(err, c) {
    if (err) {
      console.log(err);
    } else {
      console.log('abc', c);
      var data = {
        links: {
          self: 'http://localhost:3000/api/countries/' + c.id
        },
        id: c.id,
        attributes: {
          active: c.active,
          name: c.name,
          description: c.description,
          created: c.created
        },
        type: "countries"
      };
      // console.log(data);
      res.status(201)
        .header('Location', ('http://localhost:3000/api/countries/' + c.id))
        .send({
          data: data
        });
    }
  });
});

app.patch('/api/countries/:id', function(req, res) {
  Country.findOne({
    id: req.params.id
  }, function(err, country) {
    if (err) {
      console.log(err);
    } else {
      country.active = req.body.data.attributes.active;
      country.name = req.body.data.attributes.name;
      country.description = req.body.data.attributes.description;
      country.save();

      var data = {
        links: {
          self: 'http://localhost:3000/api/countries/' + country.id
        },
        id: country.id,
        attributes: {
          active: country.active,
          name: country.name,
          description: country.description,
          created: country.created
        },
        type: "countries"
      };
      res
        .status(200)
        .send({
          data: data
        });
    }
  });
});

app.delete('/api/countries/:id', function(req, res) {
  Country.findOneAndRemove({
    'id': req.params.id
  }).exec(function(err, country) {
    if (err) {
      console.log(err);
    } else {
      res.status(204).end();
    }
  });
});

app.listen('3000');

var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;

var db;
var MONGO_URL = process.env.MONGODB_URI;

MongoClient.connect(MONGO_URL, (err, database) => {
    if (err) return console.log(err)
    db = database;

})

router.post('/', function(req, res, next) {
    db.collection('students12').save(req.body, (err, result) => {
    if (err) return console.log(err)

    res.status(200).send('success');
  })
});

router.get('/submitted', function(req, res, next) {
    db.collection('students12').find({},{'activeStudent':1}).toArray(function(err, students) {
	    if (err) return console.log(err)

	    res.send(students);

    });
});

module.exports = router;
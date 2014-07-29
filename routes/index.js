var express = require('express');
var redis = require('redis');
var router = express.Router();
var client = redis.createClient();


router.get('/', function(req, res) {
  	client.zrange('typing', 0, -1, "WITHSCORES", function (err, replies) {
		var users = [];
		var scores = [];
		var ranks = [];
		var len = 100;
		if (!err) {
			replies.forEach(function(reply, i) {
				if (i % 2 == 0) {
					users.push(reply);
				} else {
					scores.push(reply);
				}
			});

			users.reverse();
			scores.reverse();
			client.quit();

			if (users.length < 100) {
				len = users.length;
			}

			res.render('index', { 
				title: 'Typing Game', 
				user: req.user,
				users: users,
				scores: scores
			});
		}
	});
});

module.exports = router;
